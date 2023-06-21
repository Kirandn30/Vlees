import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { Button } from 'native-base'
import ButtonCompo from './button'
import { useNavigation } from '@react-navigation/native'
import { navigationRef } from './RootNavigation'

const ShowCartDetails = () => {
    const { items, total_items, total_price } = useSelector((state: RootState) => state.Cart)
    const navigate = useNavigation()

    const [name, setName] = useState('Home')

    useEffect(() => {
        const unsubscribe = navigationRef.current?.addListener('state', () => {
            setName(navigationRef.current.getCurrentRoute()?.name)
        });
        return () => {
            unsubscribe();
        };
    }, [])

    if (['Home', 'Products', 'Orders', 'ProductPage'].includes(name)) {
        if (items.length > 0) {
            return (
                <View className='p-2 bg-white flex flex-row justify-between px-5'>
                    <View className=''>
                        <Text className='text-gray-500'>
                            {total_items} item in cart
                        </Text>
                        <Text className='font-bold text-lg'>
                            ₹{total_price}
                        </Text>
                    </View>
                    <View>
                        <ButtonCompo
                            disable={false}
                            //@ts-ignore
                            handelClick={() => navigate.navigate("Cart")}
                            loading={false}
                            text='View Cart'
                        />
                    </View>
                </View>
            )
        } else {
            return <View></View>
        }
    } else {
        return (
            <View></View>
        )
    }
}

export default ShowCartDetails