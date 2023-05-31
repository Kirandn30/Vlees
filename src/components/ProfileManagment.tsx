import { View, Text } from 'react-native'
import React from 'react'
import { Avatar } from 'native-base'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { PopOverCompo } from './PopOverCompo'

const ProfileManagment = () => {

    const { userDetails } = useSelector((state: RootState) => state.User)

    return (
        <View className='mr-3'>
            <PopOverCompo>
                <Avatar size="sm" bg="green.500" source={{
                    uri: userDetails.photoUrl
                }}>
                    {userDetails.name}
                </Avatar>
            </PopOverCompo>
        </View>
    )
}

export default ProfileManagment