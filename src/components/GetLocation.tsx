import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
// import Geocoder from 'react-native-geocoding';
import { Button, Card, HStack, Icon, Pressable, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import ModalCompo from './Modal';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Firebase } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, setPlaceName } from '../redux/Mapslice';
import { RootState } from '../redux';


const LocationAccess = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { placeName } = useSelector((state: RootState) => state.Location)

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permission Denied',
                        'Permission to access location was denied',
                        [{ text: 'OK' }]
                    );
                    return;
                }
                console.log("Start");
                let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
                const { latitude, longitude } = currentLocation.coords;
                console.log(latitude, longitude);
                const addMessage = Firebase.functions().httpsCallable('addMessage');
                const coordinates = {
                    latitude,
                    longitude
                }
                const res = await addMessage(coordinates)
                if (res.data.name) {
                    dispatch(setPlaceName(res.data.name))
                    dispatch(setLocation({
                        latitude: latitude,
                        longitude: longitude
                    }))
                } else {
                    Alert.alert("Error fetching location try again")
                }
            } catch (error) {
                console.log(error);
                Alert.alert("Error fetching location try again")
            }
        })()
    }, [])




    return (
        <View>
            {placeName ?
                //@ts-ignore
                <Pressable onPress={() => navigation.navigate("Your Location")}>
                    <HStack className='ml-3'>
                        <Icon color="red.500" size={5} as={<Ionicons name="location-outline" size={24} color="black" />} />
                        <Text className='mt-[1px] ml-1' numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: 100, minWidth: 30 }}>
                            {placeName}
                        </Text>
                        <Icon className='mt-[5px] ml-1 animate-pulse' size={3} as={<AntDesign name="down" size={24} color="black" />} />
                    </HStack>
                </Pressable>
                : <Text>Loading..</Text>}
        </View>
    );
};

export default LocationAccess;



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


