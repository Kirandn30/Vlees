import { Text, Linking, View } from 'react-native'
import React, { Component } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Pressable } from 'native-base';

const GetHelpOrder = ({ getHelpOrderData }: {
    getHelpOrderData: any
}) => {
    return (
        <Pressable onPress={() => Linking.openURL(`whatsapp://send?text=Hello Vlees team, I am have a dispute regarding orderId${getHelpOrderData.id}&phone=+918971892050`)}>
            <View className='bg-black p-2 rounded-2xl mr-3 flex-row justify-center gap-x-2'>
                <View>
                    < Icon
                        as={< MaterialIcons name="message" />}
                        size={18}
                        color="white"
                    />
                </View>
                <Text className='text-white pr-2'>Get Help</Text>
            </View >
        </Pressable>
    )
}

export default GetHelpOrder
