import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Button, Card, Drawer, Icon, Image } from 'native-base'
import Carousel from 'react-native-snap-carousel';
import { TouchableOpacity } from 'react-native-gesture-handler';
import VarientsCard from './VarientsCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';
import { addItems, removeItems } from '../redux/CartSlice';
import { Entypo } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

const ProductCard = ({ product, navigate }: {
    product: IProductType,
    navigate: NavigationProp<ReactNavigation.RootParamList>
}) => {
    const { items } = useSelector((state: RootState) => state.Cart)
    const { Products } = useSelector((state: RootState) => state.Listings)

    const deviceWidth = Dimensions.get("window").width;
    const [drawer, setDrawer] = useState(false)
    const dispatch = useDispatch()

    const renderItem = ({ item }: { item: string }) => {
        return (
            <View >
                <Image source={{ uri: item }} alt='' className='h-40' />
            </View>
        );
    };

    return (
        <Pressable onPress={() => {
            console.log("isdgkuhkdsug");
            //@ts-ignore
            navigate.navigate('ProductPage', { productId: product.id })
        }}>
            <View className='mb-3 mx-5 shadow-2xl bg-white overflow-hidden rounded-xl -z-50'
                style={{
                    shadowColor: "1px 12px 42px -4px rgba(0,0,0,0.75)"
                }}
            >
                <View className=''>
                    <Carousel
                        data={product.image_url}
                        renderItem={renderItem}
                        sliderWidth={deviceWidth - 40}
                        itemWidth={deviceWidth - 40}
                        layout='default'
                        showsHorizontalScrollIndicator
                        indicatorStyle="default"
                        loop
                        className='-z-50'
                    />
                    <View className='flex-row justify-between p-3'>
                        <View className='space-y-1'>
                            <Text className='font-bold text-md'>{product.variantes.length === 1 ? product.variantes[0].name : product.name}</Text>
                            {product.variantes.length === 1 ? (
                                <View className='flex-row items-center'>
                                    <View className='w-3/4'>
                                        <Text className='font-semibold text-lg'>₹{product.variantes[0].discountedPrice}</Text>
                                        <Text className='text-gray-400 line-through'>{product.variantes[0].originalPrice}</Text>
                                    </View>
                                    <View className='flex-row'>
                                        {Boolean(items.find(a => a.selectedVariant.id === product.variantes[0].id)) ? (
                                            <View className='flex flex-row items-center gap-2'>
                                                <Pressable
                                                    onPress={() => {
                                                        const targetProduct = Products.find(items => items.id === product.variantes[0].ProductId)
                                                        console.log(targetProduct, product.variantes[0].ProductId);
                                                        const copyProduct = { ...targetProduct }
                                                        delete copyProduct.variantes
                                                        dispatch(removeItems({
                                                            product: copyProduct,
                                                            quantity: 1,
                                                            selectedVariant: product.variantes[0]
                                                        }))
                                                    }}
                                                >
                                                    <Icon as={<Entypo name="minus" />} size="md" color="black" />
                                                </Pressable>
                                                <Text
                                                    className='font-extrabold text-xl'
                                                >
                                                    {items.find(a => a.selectedVariant.id === product.variantes[0].id)?.quantity}
                                                </Text>
                                                <Pressable
                                                    onPress={() => {
                                                        const targetProduct = Products.find(items => items.id === product.variantes[0].ProductId)
                                                        const copyProduct = { ...targetProduct }
                                                        delete copyProduct.variantes
                                                        dispatch(addItems({
                                                            product: copyProduct,
                                                            quantity: 1,
                                                            selectedVariant: product.variantes[0]
                                                        }))
                                                    }}
                                                >
                                                    <Icon as={<Entypo name="plus" />} size="md" color="black" />
                                                </Pressable>
                                            </View>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="xs"
                                                onPress={() => {
                                                    const targetProduct = Products.find(items => items.id === product.variantes[0].ProductId)
                                                    const copyProduct = { ...targetProduct }
                                                    delete copyProduct.variantes
                                                    dispatch(addItems({
                                                        product: copyProduct,
                                                        quantity: 1,
                                                        selectedVariant: product.variantes[0]
                                                    }))
                                                }}
                                            >
                                                <Text
                                                    className='font-semibold px-3 text-green-600'
                                                >ADD</Text>
                                            </Button>
                                        )}
                                    </View>
                                </View>
                            ) : (
                                <Text className='text-xs text-gray-500 w-11/12'>{product.caption}</Text>
                            )}
                        </View>
                        {product.variantes.length === 1 ? (
                            <View>

                            </View>
                        ) : (
                            <View className='self-end'>
                                <Button
                                    size="xs"
                                    variant="outline"
                                    onPress={() => setDrawer(true)}
                                >
                                    <Text className='font-semibold text-green-600'>{product.variantes.length} Options</Text>
                                </Button>
                            </View >
                        )}
                    </View >
                </View>
                <Drawer
                    isOpen={drawer}
                    children={<VarientsCard variantes={product.variantes} setDrawer={setDrawer} />}
                    onClose={() => setDrawer(false)}
                    key={product.id}
                    placement='bottom'
                />
            </View >
        </Pressable>
    )
}

export default ProductCard