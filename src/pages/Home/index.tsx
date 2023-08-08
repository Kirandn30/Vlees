import { View,Dimensions,Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IProductType, setCategory, setProducts, setVariants, setStoreLocation, setSelectedStore } from '../../redux/ProductsSlice'
import Categorys from './Categorys'
import { RootState } from '../../redux'
import ProductCard from '../../components/ProductCard'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import SearchBar from '../../components/SearchBar'
import { useNavigation, } from '@react-navigation/native';
import { Divider } from 'native-base'
import { geoDistance, findClosest } from '../../services/distance'
import { setLocation, setPlaceName } from '../../redux/Mapslice'
import { SelectedAddress } from '../Cart'
import { loadData } from '../../services/loadData'
import { clearCart } from '../../redux/CartSlice'
import Lottie from 'lottie-react-native';

const Home = () => {
    const dispatch = useDispatch()
    const { Products,Variants, storeLocation, selectedStore,filter, loading } = useSelector((state: RootState) => state.Listings)
    const { location, placeName } = useSelector((state: RootState) => state.Location)
    const deviceWidth = Dimensions.get("window").width;
    const [isOpen, setIsOpen] = useState(false)
    const [filteredData, setFilteredData] = useState<IProductType[]>(Products)

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

    useEffect(() => {
        console.log("filter",filter)
        if(filter){
            const data = filterProducts(Products, filter)
            setFilteredData(data);
        }
        else{
            setFilteredData(Products)
        }

    }, [filter,Products])

    const navigate = useNavigation()
    useEffect(() => {


        console.log("selectedStore", selectedStore?.id)

        loadData(selectedStore?.id,dispatch)
        
        
        
        
    }, [selectedStore])

    useEffect(() => {
        if(placeName!=="not granted" && placeName != "fetch" && storeLocation.length>0){
           console.log(location)
            const closestStore = findClosest(location,storeLocation)
            console.log("c20",closestStore)
            dispatch(setSelectedStore(closestStore))
            dispatch(clearCart())
        }


        
    }
    ,[placeName,storeLocation.length])


    useEffect(()=>{
        if(!placeName || placeName==="not granted"){
            setIsOpen(true)
            
        }
        else{
            //dispatch(clearCart()) 
            setIsOpen(false)
        }
    },[placeName])

    const renderItem = ({ item }: { item: IProductType }) => {
        const findVariants = () => {
            return Variants.filter(variant => variant.ProductId === item.id)
        }
        if (findVariants().length > 0) {
            return (
                <>
                <ProductCard product={item} navigate={navigate} />
                <Divider bg="coolGray.300" thickness="1" width={deviceWidth * 0.9} className="self-center mb-1" />
                </>
            )
        } else {
            return <View></View>
        }
    }
    if(loading) return <View className='flex-1 justify-center items-center bg-white'>
    <Text className='text-xl font-semibold'>Loading......</Text>
</View>
    return (
        <View className='bg-gray-50 min-h-screen'>
            {isOpen||!placeName || placeName==="not granted"?<SelectedAddress navigate={navigate} showSlot={false} setIsOpen={setIsOpen} />:
            <ScrollView >
                <SearchBar />
                <Categorys />
                <View className='my-5'>
                    {filteredData.length > 0 ?  
                        <View className=' text-lg px-5'>
                            <Text className="text-base">Showing {filteredData.length} results</Text>
                        </View> : 
                        <View className='text-gray-500 text-lg px-5'>
                            <Text className="text-lg">No results found</Text>
                            <Lottie source={require('../../../assets/not-found.json')} autoPlay loop style={{ height: 300 }} />
                        </View>
                    }
                    <FlatList
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                    <View className='h-28'>

                    </View>
                </View>
            </ScrollView>}
        </View>
    )
}

export default Home