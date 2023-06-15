import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Icon, IconButton, Image, Text } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

export default function RoundImageButton({ setImage, image }: any) {

    const { userDetails } = useSelector((state: RootState) => state.User)

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImage({ uri: result.assets[0].uri, error: false });
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {
                !image.uri ? (
                    <View>
                        <Button onPress={pickImage} variant="unstyled" className='p-5 bg-white rounded-full'>
                            <Icon size={30} as={<Feather name="user" color="black" />} />
                        </Button>
                        {image.error && < Text className='text-xs text-red-500'>Image is requried</Text>}
                    </View>
                ) : (
                        <View className={userDetails ? 'bg-black h-[100px] rounded-full border-solid border-[10px] border-white relative' : 'bg-black h-[100px] rounded-full border-solid border-[10px] border-white relative'}>
                        <Image
                            source={{ uri: image.uri }}
                            style={{ width: 80, height: 80 }}
                            className='rounded-full'
                            alt=''
                        />
                        <IconButton className='absolute -right-5 bg-white rounded-full'>
                            <Icon size={6} as={<Entypo name="pencil" color="black" />} />
                        </IconButton>
                    </View>
                )
            }
        </View >
    );
}