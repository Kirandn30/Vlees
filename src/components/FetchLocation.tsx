import { Button, Text, View } from 'native-base'
import React, { useEffect } from 'react'
import Lottie from 'lottie-react-native';
import ButtonCompo from './button';
import { openAppSettings } from './GetLocation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';
import { Platform } from "react-native"


export const FetchLocation = ({ getLocFunc }: {
    getLocFunc: () => void
}) => {
    const { placeName,addresses } = useSelector((state: RootState) => state.Location)

    useEffect(() => {
        if (Platform.OS === "android") {
            setTimeout(() => {
                getLocFunc()
            }, 100);
        }
        getLocFunc()
    }, [addresses])

    return (
        placeName !== "not granted" ? <View className="h-screen flex-row justify-center items-center">
            <View>
                <Lottie source={require('../../assets/fetchlocation.json')} autoPlay loop style={{ height: 150 }} />
                <Text className="text-center font-bold text-lg text-gray-500">Featching Your Location</Text>
            </View>
        </View> : <View className='flex-1 justify-center items-center'>
            <Text className='p-5'>Location Permission Requried</Text>
            <View className='flex-row '>
                <Button
                    variant="outline"
                    color="black"
                    className='mr-5'
                    onPress={getLocFunc}
                >Try Again</Button>
                <ButtonCompo
                    disable={false}
                    handelClick={openAppSettings}
                    loading={false}
                    text='Give Access'
                />
            </View>
        </View>
    )
}