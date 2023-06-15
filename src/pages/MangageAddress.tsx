import { View, Text } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { Button, Divider } from 'native-base'

const MangageAddress = () => {

    const { addresses } = useSelector((state: RootState) => state.Location)

    return (
        <View className='p-5'>
            <Text className='text-lg font-medium text-center'>Mangage Address</Text>
            {addresses.map(item => (
                <View className='bg-white p-2 rounded-lg my-3'>
                    <Text className='text-base font-medium'>{item.addressName}</Text>
                    <Text>{item.houseFlatNo}</Text>
                    <Text>{item.buildingName}</Text>
                    <Text>{item.placeName}</Text>
                    <Divider className='my-3' />
                    <View className='flex-row'>
                        <Button variant={'unstyled'} className='grow'>
                            <Text className='text-red-500'>Delete</Text>
                        </Button>
                        <Button variant={'unstyled'} className='grow'>
                            <Text className='text-blue-500'>Edit</Text>
                        </Button>
                    </View>
                </View>
            ))}
        </View>
    )
}

export default MangageAddress