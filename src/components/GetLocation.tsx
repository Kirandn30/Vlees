import React, { useEffect } from 'react';
import { View, Alert, Linking, Platform } from 'react-native';
import { HStack, Icon, Pressable, Text, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';




const LocationAccess = ({ getLocFunc }: any) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { placeName } = useSelector((state: RootState) => state.Location)

    useEffect(() => {
        getLocFunc()
    }, [])

    return (
        <View>
            {placeName !== "not granted" ?
                //@ts-ignore
                (<Pressable onPress={() => navigation.navigate("Your Location")}>
                    <HStack className='ml-3'>
                        <Icon color="red.500" size={5} as={<Ionicons name="location-outline" size={24} color="black" />} />
                        <Text className='mt-[1px] ml-1' numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: 100, minWidth: 30 }}>
                            {placeName}
                        </Text>
                        <Icon className='mt-[5px] ml-1 animate-pulse' size={3} as={<AntDesign name="down" size={24} color="black" />} />
                    </HStack>
                </Pressable>)
                : (<Text>
                </Text>)}
        </View>
    );
};

export default LocationAccess;

export const openAppSettings = async () => {
    // For iOS
    if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:')
    }
    // For Android
    else if (Platform.OS === 'android') {
        Linking.openSettings();
    }
}

// useEffect(() => {
//     const requestLocation = async () => {
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//             Alert.alert(
//                 'Permission Denied',
//                 'Permission to access location was denied',
//                 [{ text: 'OK' }]
//             );
//             return;
//         }
//         let currentLocation = await Location.getCurrentPositionAsync({});
//         const { latitude, longitude } = currentLocation.coords;
//         setLocation({ latitude, longitude });
//         const latlng = {
//             lat: latitude,
//             lng: longitude,
//         };
//         const response = await Geocoder.from(latlng);
//         if (response.results[0]) {
//             setRegion({
//                 ...region,
//                 latitude: latlng.lat,
//                 longitude: latlng.lng,
//             });
//             setMarker({
//                 latitude: latlng.lat,
//                 longitude: latlng.lng,
//                 title: response.results[0].formatted_address,
//             });
//             setCalloutVisible(true);
//         } else {

//             Alert.alert('No results found');
//         }
//     };
//     requestLocation();
// }, []);


