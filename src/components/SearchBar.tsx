import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Divider, Icon, Input } from 'native-base'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';
import { FlatList } from 'react-native-gesture-handler';
import { setFilter } from '../redux/ProductsSlice';


const SearchBar = () => {

    const [filteredData, setFilteredData] = useState<IProductType[]>([])
    const { Products,filter } = useSelector((state: RootState) => state.Listings)
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
      console.log("dipatch",filter)
    }, [filter])
    

    const renderSuggestion = (items: IProductType) => (
        <TouchableOpacity onPress={() => dispatch(setFilter(items.name))}>
        <View className=' rounded-xl'>
            <View className='p-3'>
                <Text>{items.name}</Text>
            </View>
            <Divider className='bg-gray-200' />
        </View>
        </TouchableOpacity>
    )

    return (
        <View className='p-3 flex-row gap-3'>
            <View className='grow relative'>
                <Input
                    placeholder='Search'
                    className='placeholder:text-lg font-semibold h-10'
                    InputLeftElement={<Icon as={<AntDesign name="search1" size={24} color="black" />} className='text-gray-400 ml-3' />}
                    backgroundColor="#F3F4F6FF"
                    borderColor="white"
                    value={filter || ''}
                    onChangeText={(e) => {
                        setOpen(true)
                        const data = filterProducts(Products, e)
                        dispatch(setFilter(e))
                        if (e) {
                            setFilteredData(data);
                        } else {
                            setFilteredData([])
                        }
                    }}

                    onBlur={() => setOpen(false)}

                    rightElement={ filter ? 
                        <Button style={{backgroundColor:'transparent'}} onPress={() => dispatch(setFilter(null))}>
                    <Icon as={<Ionicons name="close" size={24} color="black" />} className='text-gray-400' /> 
                    </Button>
                    :undefined    }
                />
                {open && filteredData.length > 0 && <View style={styles.suggestionsContainer} className='z-50'>
                    <FlatList
                        keyboardShouldPersistTaps='always' //open keyboard
                        data={filteredData}
                        renderItem={({ item }) => renderSuggestion(item)}
                        keyExtractor={(item) => item.id}
                    />
                </View>}
            </View>
            {/* <Button bgColor="#F3F4F6FF">
                <Icon as={<Ionicons name="filter" size={24} color="black" />} />
            </Button> */}
        </View>
    )
}

export default SearchBar


const filterProducts = (products: IProductType[], searchText: string) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return products.filter((product) => {
        // Check if any field in the product matches the search text
        return Object.values(product).some((value) => {
            if (typeof value === 'string') {
                return value.toLowerCase().includes(lowerCaseSearchText);
            }
            return false;
        });
    });
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 40, // Adjust the top position based on your layout
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 10,
    },
    suggestionText: {
        padding: 10,
    },
});