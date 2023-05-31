import { View, Text } from 'react-native'
import React from 'react'
import { Icon, Input } from 'native-base'
import { AntDesign } from '@expo/vector-icons';


const SearchBar = () => {
    return (
        <View className='p-3'>
            <Input
                placeholder='Search'
                className='placeholder:text-lg font-semibold'
                InputLeftElement={<Icon as={<AntDesign name="search1" size={24} color="black" />} className='text-gray-400 ml-3' />}
            />
        </View>
    )
}

export default SearchBar