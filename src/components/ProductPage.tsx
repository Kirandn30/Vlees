import { View, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { RouteProp, useNavigation } from '@react-navigation/native';
import { setCategoryName } from '../redux/ProductsSlice';
import { HStack, Icon, Image, Text } from 'native-base';
import Carousel from 'react-native-snap-carousel';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import VarientsCard from './VarientsCard';

type RootStackParamList = {
    Product: { categoryId: string };
};

type Props = {
    route: RouteProp<RootStackParamList, 'Product'>;
}

const ProductPage: React.FC<Props> = ({ route }) => {
    const [product, setProduct] = useState<null | IProductType>(null)
    const [variants, setVariants] = useState<IVariantType[]>([])
    const { Products, Variants } = useSelector((state: RootState) => state.Listings)
    const navigate = useNavigation()
    const dispatch = useDispatch()
    const deviceWidth = Dimensions.get("window").width;

    useEffect(() => {
        console.log(route.params)
        //@ts-ignore
        const data = Products.find(pro => pro.id === route.params.productId)
        if (data) {
            setProduct(data)
            const varData = Variants.filter(vari => vari.ProductId === data.id)
            if (varData) setVariants(varData)
            console.log(data)
            dispatch(setCategoryName(data.name))
        } else {
            //@ts-ignore
            navigate.navigate("Home")
        }
    }, [route.name, Products])

    const renderItem = ({ item }: { item: string }) => {
        return (
            <View >
                <Image source={{ uri: item }} alt="img" style={{ width: deviceWidth, height: 200, borderRadius: 5 }} />
            </View>
        );
    };

    return (
        product &&
        <View className='p-3 bg-white'>
            <Carousel
                data={product.image_url}
                renderItem={renderItem}
                sliderWidth={deviceWidth - 24}
                itemWidth={deviceWidth - 24}
                layout='default'
                showsHorizontalScrollIndicator
                indicatorStyle="default"
                loop
                className='-z-50'
            />
            <View >
                <View className='p-3'>
                    <Text className='text-xl font-medium'>{product.name}</Text>
                    <Text className='text-sm text-gray-500'>{product.caption}</Text>
                </View>
                <View className='p-5 border-solid border-gray-300 border-[1px] rounded-md'>
                    <View className='mb-3'>
                        <HStack space={3} justifyContent="space-between" className=''>
                            <View className='flex-row gap-3'>
                                <Icon
                                    as={<FontAwesome5 name="weight-hanging" />}
                                    size={18}
                                    color="black"
                                />
                                <Text>Net wt. 500 grams</Text>
                            </View>
                            <View className='flex-row gap-3'>
                                <Icon
                                    as={<MaterialCommunityIcons name="food-variant" />}
                                    size={18}
                                    color="black"
                                />
                                <Text>Serves 4</Text>
                            </View>
                        </HStack>
                    </View>
                    <View className='flex-row gap-3'>
                        <Icon
                            as={<MaterialCommunityIcons name="silverware-fork-knife" />}
                            size={18}
                            color="black"
                        />
                        <Text>No. of Pieces 13-19</Text>
                    </View>
                </View>
                <View className='mt-5'>
                    <VarientsCard
                        variantes={variants}
                    />
                </View>
            </View>
        </View >
    )
}

export default ProductPage