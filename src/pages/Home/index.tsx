import { View,Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Firebase } from '../../../config'
import { useDispatch, useSelector } from 'react-redux'
import { IProductType, setCategory, setProducts, setVariants } from '../../redux/ProductsSlice'
import Categorys from './Categorys'
import { RootState } from '../../redux'
import ProductCard from '../../components/ProductCard'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import SearchBar from '../../components/SearchBar'
import { useNavigation, } from '@react-navigation/native';
import { Divider } from 'native-base'

const Home = () => {
    const dispatch = useDispatch()
    const { Products,Variants } = useSelector((state: RootState) => state.Listings)
    const deviceWidth = Dimensions.get("window").width;

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
        Firebase.firestore().collection("Variant").get()
            .then(res => {
                dispatch(setVariants(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
            })
    }, [])

    const renderItem = ({ item }: { item: IProductType }) => {
        if (item.variantes.length > 0) {
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