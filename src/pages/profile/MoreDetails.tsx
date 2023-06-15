import { View, Text } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider, Icon, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MoreDetails = () => {

    const navigate = useNavigation()

    return (
        <View className='p-5 grow'>
            {detailsList.map(item => (
                //@ts-ignore
                <Pressable onPress={() => navigate.navigate(item.route)}>
                    <View className='flex-row justify-between'>
                        <View className='flex-row gap-5'>
                            <Icon
                                as={item.logo}
                                size={22}
                            />
                            <Text className='font-medium'>{item.name}</Text>
                        </View>
                        <Icon
                            as={<MaterialIcons name="chevron-right" size={24} color="black" />}
                        />
                    </View>
                    <Divider className='my-3' />
                </Pressable>
            ))}
        </View>
    )
}

export default MoreDetails

const detailsList = [
    {
        name: "Manage Addresses",
        route: "ManageAddress",
        logo: <AntDesign name="contacts" size={24} color="black" />
    },
    {
        name: "About",
        route: "About",
        logo: <Ionicons name="information-circle-outline" size={24} color="black" />
    },
    {
        name: "Send feedback",
        route: "Feedback",
        logo: <MaterialCommunityIcons name="message-text-outline" size={24} color="black" />
    },
    {
        name: "Privacy policy",
        route: "Privacy",
        logo: <AntDesign name="lock" size={24} color="black" />
    },
    {
        name: "Terms & Conditions",
        route: "Terms",
        logo: <MaterialCommunityIcons name="clipboard-text-outline" size={24} color="black" />
    },
]