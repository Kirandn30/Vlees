import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Firebase } from '../../../config'
import { useDispatch, useSelector } from 'react-redux'
import { IProductType, setCategory, setProducts } from '../../redux/ProductsSlice'
import Categorys from './Categorys'
import { RootState } from '../../redux'
import ProductCard from '../../components/ProductCard'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import SearchBar from '../../components/SearchBar'
import { useNavigation, } from '@react-navigation/native';

const Home = () => {
    const dispatch = useDispatch()
    const { Products } = useSelector((state: RootState) => state.Listings)

    const navigate = useNavigation()
    useEffect(() => {
        Firebase.firestore().collection("Catogory").get()
            .then(res => {
                dispatch(setCategory(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
            })
        Firebase.firestore().collection("Product").get()
            .then(res => {
                dispatch(setProducts(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
            })
    }, [])

    const renderItem = ({ item }: { item: IProductType }) => {
        if (item.variantes.length > 0) {
            return (
                <ProductCard product={item} navigate={navigate} />
            )
        } else {
            return <View></View>
        }
    }
    return (
        <View className='bg-gray-50 min-h-screen'>
            <ScrollView >
                <SearchBar />
                <Categorys />
                <View className='my-5'>
                    <FlatList
                        data={Products}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                    <View className='h-28'>

                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Home