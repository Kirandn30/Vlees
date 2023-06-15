import { Pressable, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider, Icon, Text } from 'native-base'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { navigationRef } from './RootNavigation';

const ButtomNavBar = ({ Stack }: {
    Stack: any
}) => {

    const [name, setName] = useState('Home')

    useEffect(() => {
        const unsubscribe = navigationRef.current?.addListener('state', () => {
            setName(navigationRef.current.getCurrentRoute()?.name)
        });
        return () => {
            unsubscribe();
        };
    }, [])

    if (['Home', 'Products', 'Orders', 'Contact'].includes(name)) {
        return (
            <View>
                <Divider />
                <View className='h-14 flex flex-row justify-center bg-white mt-1'>
                    <Pressable className={name === "Home" ? 'grow flex justify-center items-center space-y-1 rounded-full scale-125 transform duration-1000 ease-in-out' : 'grow flex justify-center items-center space-y-1'}
                        onPress={() => navigationRef.current?.navigate('Home')}
                    >
                        <Icon as={<AntDesign name="home" size={24} />} color={name === "Home" ? "#B9181DFF" : "black"} />
                        <Text className={name === "Home" ? "text-xs text-[#B9181DFF]" : "black text-xs"}>Home</Text>
                    </Pressable>
                    <Pressable className={name === "Products" ? 'grow flex justify-center items-center space-y-1 rounded-full scale-125 transform duration-1000 ease-in-out' : 'grow flex justify-center items-center space-y-1'}
                        onPress={() => //@ts-ignore
                            navigationRef.current?.navigate('Products')}
                    >
                        <Icon as={<MaterialCommunityIcons name="food-drumstick" size={24} color="black" />} color={name === "Products" ? "#B9181DFF" : "black"} />
                        <Text className={name === "Products" ? "text-xs text-[#B9181DFF]" : "black text-xs"}>Products</Text>
                    </Pressable>
                    <Pressable className={name === "Orders" ? 'grow flex justify-center items-center space-y-1 rounded-full scale-125 transform duration-1000 ease-in-out' : 'grow flex justify-center items-center space-y-1'}
                        onPress={() => //@ts-ignore
                            navigationRef.current?.navigate('Orders')}
                    >
                        <Icon as={<FontAwesome5 name="list" size={24} />} color={name === "Orders" ? "#B9181DFF" : "black"} />
                        <Text className={name === "Orders" ? "text-xs text-[#B9181DFF]" : "black text-xs"}>Orders</Text>
                    </Pressable>
                    <Pressable className={name === "Contact" ? 'grow flex justify-center items-center space-y-1 rounded-full scale-125 transform duration-1000 ease-in-out' : 'grow flex justify-center items-center space-y-1'}
                        onPress={() => //@ts-ignore
                            navigationRef.current?.navigate('Contact')}
                    >
                        <Icon as={<FontAwesome5 name="headset" size={24} />} color={name === "Contact" ? "#B9181DFF" : "black"} />
                        <Text className={name === "Contact" ? "text-xs text-[#B9181DFF]" : "black text-xs"}>Contact</Text>
                    </Pressable>
                </View>
            </View>
        )
    } else {
        return (
            <View></View>
        )
    }
}

export default ButtomNavBar

const getCurrentPathName = () => {
    const navigationState = navigationRef.current?.getRootState();
    const currentRoute = navigationState?.routes[navigationState.index];
    const currentPathName = currentRoute?.name;
    return currentPathName;
};