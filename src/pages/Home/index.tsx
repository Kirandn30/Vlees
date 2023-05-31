import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Firebase } from '../../../config'
import { useDispatch, useSelector } from 'react-redux'
import { setCategory, setProducts } from '../../redux/ProductsSlice'
import Categorys from './Categorys'
import { RootState } from '../../redux'
import ProductCard from '../../components/ProductCard'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import ButtomNavBar from '../../components/ButtomNavBar'
import { Text } from 'native-base'
import SearchBar from '../../components/SearchBar'
import ShowCartDetails from '../../components/ShowCartDetails'

const Home = () => {
    const dispatch = useDispatch()
    const { Products } = useSelector((state: RootState) => state.Listings)
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

    const renderItem = ({ item }: any) => (
        <ProductCard product={item} />
    )

    return (
        <View className='bg-red-50 flex-1 justify-between'>
            <SearchBar />
            <Categorys />
            <ScrollView horizontal>
                <FlatList
                    data={Products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </ScrollView>
            <ShowCartDetails />
            <ButtomNavBar />
        </View>
    )
}

export default Home