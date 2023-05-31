import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import ButtonCompo from './button'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { addItems, removeItems } from '../redux/CartSlice'
import { RootState } from '../redux'
import { Entypo } from '@expo/vector-icons';
import { Icon } from 'native-base'

const VarientsCard = ({ variantes, setDrawer }: {
    variantes: IVariantType[]
    setDrawer: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { Products } = useSelector((state: RootState) => state.Listings)
    const { items } = useSelector((state: RootState) => state.Cart)
    const dispatch = useDispatch()
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const filteredProducts = items.filter((item => item.product.id === variantes[0].ProductId))
        if (filteredProducts.length > 0) {
            const totalPrice = filteredProducts.reduce((accumulator, currentItem) => {
                const { quantity, selectedVariant } = currentItem;
                const itemPrice = quantity * selectedVariant.discountedPrice;
                return accumulator + itemPrice;
            }, 0);
            setTotal(totalPrice)
        } else {
            setTotal(0)
        }
    }, [items])

    return (
        <View className='bg-white p-5'>
            {variantes.map(item => {
                return (
                    <View key={item.id} className='p-3 px-5 rounded-2xl bg-gray-100 flex-row justify-between mb-3 shadow'>
                        <View>
                            <Text className='underline font-medium'>{item.name}</Text>
                            <Text className='font-extrabold text-lg'>₹{item.discountedPrice}</Text>
                            <Text className='text-xs line-through text-gray-500'>₹{item.originalPrice}</Text>
                        </View>
                        <View className='self-center'>
                            {Boolean(items.find(a => a.selectedVariant.id === item.id)) ? (
                                <View className='flex flex-row items-center gap-2'>
                                    <Pressable
                                        onPress={() => {
                                            const targetProduct = Products.find(items => items.id === item.ProductId)
                                            console.log(targetProduct, item.ProductId);
                                            const copyProduct = { ...targetProduct }
                                            delete copyProduct.variantes
                                            dispatch(removeItems({
                                                product: copyProduct,
                                                quantity: 1,
                                                selectedVariant: item
                                            }))
                                        }}
                                    >
                                        <Icon as={<Entypo name="minus" />} size="md" color="black" />
                                    </Pressable>
                                    <Text
                                        className='font-extrabold text-xl'
                                    >
                                        {/*@ts-ignore */}
                                        {items.find(a => a.selectedVariant.id === item.id)?.quantity}
                                    </Text>
                                    <Pressable
                                        onPress={() => {
                                            const targetProduct = Products.find(items => items.id === item.ProductId)
                                            const copyProduct = { ...targetProduct }
                                            delete copyProduct.variantes
                                            dispatch(addItems({
                                                product: copyProduct,
                                                quantity: 1,
                                                selectedVariant: item
                                            }))
                                        }}
                                    >
                                        <Icon as={<Entypo name="plus" />} size="md" color="black" />
                                    </Pressable>
                                </View>
                            ) : (
                                <Pressable
                                    onPress={() => {
                                        const targetProduct = Products.find(items => items.id === item.ProductId)
                                        const copyProduct = { ...targetProduct }
                                        delete copyProduct.variantes
                                        dispatch(addItems({
                                            product: copyProduct,
                                            quantity: 1,
                                            selectedVariant: item
                                        }))
                                    }}
                                >
                                    <Text
                                        className='font-extrabold text-xl'
                                    >ADD</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                )
            })}
            <View className='p-3 bg-green-700 rounded-2xl flex flex-row justify-between px-6'>
                <Text className='text-white text-base font-semibold'>Item Total : ₹{total}</Text>
                <Pressable onPress={() => setDrawer(false)}>
                    <Text className='text-white text-base font-semibold'>Confirm</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default VarientsCard