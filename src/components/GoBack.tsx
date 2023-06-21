import React from 'react'
import { Button, Icon } from 'native-base'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const GoBack = () => {
    const navigation = useNavigation();
    const getPreviousStack = () => {
        const { routes } = navigation.getState();
        const previousStack = routes[routes.length - 2].name;
        return previousStack
    };
    return (
        <Button variant="unstyled"
            onPress={() => {
                if (getPreviousStack() === "SlotBook") {
                    //@ts-ignore
                    navigation.navigate("Home")
                } else {
                    navigation.goBack()
                }
            }}
        >
            <Icon className='mt-[5px] ml-1 animate-pulse' size={3} as={<AntDesign name="left" size={24} color="black" />} />
        </Button>
    )
}

export default GoBack;