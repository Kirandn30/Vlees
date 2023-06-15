import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Firebase } from '../../../config'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { } from "../../../config"
import { setOrders } from '../../redux/orderSlice'
import { Badge, Button, Pressable } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'

const Orders = () => {
    const { User } = useSelector((state: RootState) => state.User)
    const { Orders } = useSelector((state: RootState) => state.Orders)
    const navigate = useNavigation()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!User) return
        onSnapshot(query(collection(Firebase.firestore(), "Orders"), where("UserId", "==", User.uid), orderBy("date_created", "desc")), (snap) => {
            dispatch(setOrders(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
        })

    }, [])

    return (
        <ScrollView>
            <View className='my-5 space-y-3'>
                {Orders.map(order => (
                    //@ts-ignore
                    <Pressable onPress={() => navigate.navigate('OrderId', { orderId: order.id })}>
                        <View className='bg-white p-5 mx-3 rounded-lg' key={order.id}>
                            <View className='flex-row'>
                                <View className='grow'>
                                    <Text numberOfLines={1} className='font-medium w-48'>{order.items.map((item: any) => item.product.name).toString() + "dsfdsfdsfdssfdsff"}</Text>
                                </View>
                                <View>
                                    <Badge variant="solid">{order.status.toUpperCase()}</Badge>
                                </View>
                            </View>
                            <View>
                                {order.items.map((item: any) => (
                                    <View className='flex-row gap-5' key={item.id}>
                                        <Text>{item.selectedVariant.name}</Text>
                                        <Text>x {item.quantity}</Text>
                                    </View>
                                ))}
                            </View>
                            <View className='flex-row p-3 gap-5'>
                                <Button size="xs" className='grow' variant="outline">
                                    <Text className='text-red-400'>Rate Order</Text>
                                </Button>
                                <Button size="xs" className='grow' variant="outline">
                                    <Text className='text-red-400'>Re-Order</Text>
                                </Button>
                            </View>
                        </View>
                    </Pressable>
                ))}
        </View>
        </ScrollView>
    )
}

export default Orders