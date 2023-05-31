import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'


const Categorys = () => {
    const { Category, Products } = useSelector((state: RootState) => state.Listings)
    const navigation = useNavigation();

    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Category.map((category) => (
                    //@ts-ignore
                    <TouchableOpacity key={category.id} onPress={() => navigation.navigate("Products", { categoryId: category.id })}>
                        <View key={category.id} className="rounded-full m-2">
                            <Image
                                source={{ uri: category.image_url }}
                                style={{ width: 70, height: 70, borderRadius: 50 }}
                                alt={category.name}
                            />
                            <Text className='text-center font-bold mt-2 text-sm '>{category.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View >
    )
}

export default Categorys