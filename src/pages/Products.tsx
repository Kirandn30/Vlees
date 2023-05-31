import { View, Text, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, } from '@react-navigation/native';
import { Firebase } from '../../config';
import { setProducts } from '../redux/ProductsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';
import { Card, Image } from 'native-base';
import ProductCard from '../components/ProductCard';
import ShowCartDetails from '../components/ShowCartDetails';
import SearchBar from '../components/SearchBar';
import ButtomNavBar from '../components/ButtomNavBar';
import { FlatList } from 'react-native-gesture-handler';

type RootStackParamList = {
    Product: { categoryId: string };
};

type Props = {
    route: RouteProp<RootStackParamList, 'Product'>;
}

const Products: React.FC<Props> = ({ route }) => {
    const { Products } = useSelector((state: RootState) => state.Listings)
    const { items } = useSelector((state: RootState) => state.Cart)
    const [fliteredProducts, setFliteredProducts] = useState<any[]>([])
    const deviceHeight = Dimensions.get("window").height;
    useEffect(() => {
        if (!route.params) {
            setFliteredProducts(Products)
        } else {
            setFliteredProducts(Products.filter(item => item.categoryId === route.params.categoryId))
        }
    }, [route.params])

    const renderItem = ({ item }: { item: IProductType }) => (
        <ProductCard key={item.id} product={item} />
    );


    return (
        <View className='bg-red-50 flex-1 justify-between'>
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
                <ButtomNavBar />
            </View>
        </View>
    )
}

export default Products