import { View, Text, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, } from '@react-navigation/native';
import { Firebase } from '../../config';
import { setCategoryName, setProducts } from '../redux/ProductsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';
import { Card, Image } from 'native-base';
import ProductCard from '../components/ProductCard';
import ShowCartDetails from '../components/ShowCartDetails';
import SearchBar from '../components/SearchBar';
import ButtomNavBar from '../components/ButtomNavBar';
import { FlatList } from 'react-native-gesture-handler';
import Lottie from 'lottie-react-native';


type RootStackParamList = {
    Product: { categoryId: string };
};

type Props = {
    route: RouteProp<RootStackParamList, 'Product'>;
}

const Products: React.FC<Props> = ({ route }) => {
    const { Products, Category, CategoryName } = useSelector((state: RootState) => state.Listings)
    const { items } = useSelector((state: RootState) => state.Cart)
    const [fliteredProducts, setFliteredProducts] = useState<any[]>([])
    const [isEmpty, setIsEmpty] = useState(false)
    const deviceHeight = Dimensions.get("window").height;
    const dispatch = useDispatch()
    const navigate = useNavigation()
    useEffect(() => {
        if (!route.params) {
            setIsEmpty(Products.length === 0 ? true : false)
            setFliteredProducts(Products)
        } else {
            setIsEmpty(Products.filter(item => item.categoryId === route.params.categoryId).length === 0 ? true : false)
            dispatch(setCategoryName(Category.find(item => item.id === route.params.categoryId)?.name))
            setFliteredProducts(Products.filter(item => item.categoryId === route.params.categoryId))
        }
    }, [route.params])

    const renderItem = ({ item }: { item: IProductType }) => {
        if (item.variantes.length > 0) {
            return (
                <ProductCard product={item} key={item.id} navigate={navigate} />
            )
        } else {
            return (
                <View></View>
            )
        }
    };


    return (
        !isEmpty ? <View className='flex-1 justify-between'>
            <View className='mt-5'>
                <FlatList
                    style={{ height: items.length > 0 ? deviceHeight - 200 : deviceHeight - 150 }}
                    data={fliteredProducts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View> 
            <View className=''>
                <ShowCartDetails />
            </View>
        </View> : (
            <View className="h-screen flex-row justify-center items-center">
                <View>
                    <Lottie source={require('../../assets/not-found.json')} autoPlay loop style={{ height: 300 }} />
                    <Text className="text-center font-bold text-lg text-gray-500">No {CategoryName} products</Text>
                </View>
            </View>
        )

    )
}

export default Products