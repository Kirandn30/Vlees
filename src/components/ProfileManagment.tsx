import { View, Text } from 'react-native'
import React from 'react'
import { Avatar, Pressable } from 'native-base'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { PopOverCompo } from './PopOverCompo'
import { useNavigation } from '@react-navigation/native'

const ProfileManagment = () => {

    const { userDetails } = useSelector((state: RootState) => state.User)
    const navigate = useNavigation()
    return (
        //@ts-ignore
        <Pressable onPress={() => navigate.navigate("Profile")}>
            <View className='mr-3'>
                <Avatar size="sm" bg="green.500" source={{
                    uri: userDetails.photoUrl
                }}>
                    {userDetails.name}
                </Avatar>
            </View>
        </Pressable>
    )
}

export default ProfileManagment