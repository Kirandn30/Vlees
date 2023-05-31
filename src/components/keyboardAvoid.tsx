import { Center, VStack } from 'native-base';
import React from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';

type Props = {
    children: React.ReactNode
}

const CustomKeyboardAvoidingView = ({ children }: Props) => {
    const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

    return (
        //@ts-ignore
        <KeyboardAvoidingView h={{
            base: "400px",
            lg: "auto"
        }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Center>
                <VStack flex="1" justifyContent="flex-end" w="100%" maxW="300">
            {children}
                </VStack>
            </Center>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: -1,
        justifyContent: 'center',
    },
});

export default CustomKeyboardAvoidingView;