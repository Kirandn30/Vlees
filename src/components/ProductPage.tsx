import { View, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { RouteProp, useNavigation } from '@react-navigation/native';
import { setCategoryName } from '../redux/ProductsSlice';
import { Icon, Image, Text } from 'native-base';
import Carousel from 'react-native-snap-carousel';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type RootStackParamList = {
    Product: { categoryId: string };
};

type Props = {
    route: RouteProp<RootStackParamList, 'Product'>;
}

const ProductPage: React.FC<Props> = ({ route }) => {
    const [product, setProduct] = useState<null | IProductType>(null)
    const { Products } = useSelector((state: RootState) => state.Listings)
    const navigate = useNavigation()
    const dispatch = useDispatch()
    const deviceWidth = Dimensions.get("window").width;

    useEffect(() => {
        //@ts-ignore
        const data = Products.find(pro => pro.id === route.params.productId)
        if (data) {
            setProduct(data)
            dispatch(setCategoryName(data.name))
        } else {
            //@ts-ignore
            navigate.navigate("Home")
        }
    }, [route.name, Products])

    const renderItem = ({ item }: { item: string }) => {
        return (
            <View >
                <Image source={{ uri: item }} alt='' className='h-52' />
            </View>
        );
    };

    return (
        product &&
        <View>
            <Carousel
                data={product.image_url}
                renderItem={renderItem}
                sliderWidth={deviceWidth}
                itemWidth={deviceWidth}
                layout='default'
                showsHorizontalScrollIndicator
                indicatorStyle="default"
                loop
                className='-z-50'
            />
            <View className='p-5'>
                <Text className='text-xl font-medium'>{product.name}</Text>
                <Text className='text-sm text-gray-500'>{product.caption}</Text>
                <View>
                    <View className='flex-row'>
                        <View>
                            <Icon
                                as={<FontAwesome5 name="weight-hanging" />}
                                size={22}
                                color="black"
                            />
                            <Text>Net wt. </Text>
                        </View>
                        <View>
                            <Icon
                                as={<MaterialCommunityIcons name="food-variant" />}
                                size={22}
                                color="black"
                            />
                        </View>
                    </View>
                    <Icon
                        as={<MaterialCommunityIcons name="silverware-fork-knife" />}
                        size={22}
                        color="black"
                    />
                </View>
            </View>
        </View>
    )
}

export default ProductPage