import { View, Text, Pressable, Linking } from 'react-native'
import React from 'react'
import { Icon } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
const Contact = () => {
    return (
        <View>
            <View>
                <Pressable onPress={() => Linking.openURL('mailto:support@meatforyou.com?subject=SendMail&body=Description')}>
                    <View className='bg-white p-3 m-3 rounded-lg space-y-1 border-solid  border-yellow-500 border-l-[10px]'>
                        <View className='flex-row gap-1 items-center justify-center'>
                            <Icon
                                as={<MaterialIcons name="mail-outline" />}
                                size={22} color="black"
                            />
                            <Text className='font-medium '>Email :</Text>
                        </View>
                        <Text className='text-center'>support@meatforyou.com</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => Linking.openURL('whatsapp://send?text=hello&phone=+918971892050')}>
                    <View className='bg-white p-3 m-3 rounded-lg space-y-1 border-solid  border-green-500 border-l-[10px]'>
                        <View className='flex-row gap-1 items-center justify-center'>
                            <Icon
                                as={<FontAwesome name="whatsapp" />}
                                size={22} color="black"
                            />
                            <Text className='font-medium '>Whatsapp :</Text>
                        </View>
                        <Text className='text-center'>+919607293922</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => Linking.openURL(`tel:+918971892050}`)}>
                    <View className='bg-white p-3 m-3 rounded-lg space-y-1 border-solid  border-blue-500 border-l-[10px]'>
                        <View className='flex-row gap-1 items-center justify-center'>
                            <Icon
                                as={<Ionicons name="call-outline" />}
                                size={22} color="black"
                            />
                            <Text className='font-medium '>Call us :</Text>
                        </View>
                        <Text className='text-center'>+919607293922</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export default Contact