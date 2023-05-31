import { View, Text } from 'react-native'
import React from 'react'
import { Button, Icon } from 'native-base'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const GoBack = () => {
    const navigation = useNavigation();
    return (
        <Button variant="unstyled"
            onPress={() => navigation.goBack()}
        >
            <Icon className='mt-[5px] ml-1 animate-pulse' size={3} as={<AntDesign name="left" size={24} color="black" />} />
        </Button>
    )
}

export default GoBack