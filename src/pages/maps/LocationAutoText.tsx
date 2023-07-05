import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, ScrollView, Pressable, Alert } from 'react-native';
import { debounce } from 'lodash';
import { Firebase } from '../../../config';
import { Divider, Icon, Input, Spinner } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { setAddresses, setLocation, setLocationCopy, setPlaceName } from '../../redux/Mapslice';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { RootState } from '../../redux';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { findClosest, geoDistance } from '../../services/distance';

interface LocationAutocompleteProps { }


const getLocationSuggestions = Firebase.functions().httpsCallable('getLocationSuggestions');
const getLongAndLat = Firebase.functions().httpsCallable('getLongAndLat');

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = () => {
    const [queryy, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState<string|null>(null)
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { User } = useSelector((state: RootState) => state.User)
    const { addresses } = useSelector((state: RootState) => state.Location)

    const handleQueryChange = (text: string) => {
        setQuery(text);
    };

    useEffect(() => {
        if (!User) return
        const unsub = onSnapshot(query(collection(Firebase.firestore(), "Address"), where("userId", "==", User.uid)), (snap) => {
            dispatch(setAddresses(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
        })
        return () => unsub()
    }, [])


    const debouncedCallback = debounce(async (text: string) => {
        try {
            const response = await getLocationSuggestions({ query: text });
            setSuggestions(response.data.suggestions);
        } catch (error) {
            console.error(error);
        }
    }, 400);

    useEffect(() => {
        if (!queryy) {
            setSuggestions([])
        } else {
            debouncedCallback(queryy);
        }
    }, [queryy]);

    const renderAddressSuggestion = (item: any) => {
        return (
            <Pressable onPress={() => {
                dispatch(setPlaceName(item.addressName))
                dispatch(setLocation(item.location))
                //@ts-ignore
                navigation.navigate('Home')
            }}>
                <View className='p-3 py-1 border-solid border-[1px] border-gray-300 rounded-lg space-y-1 bg-white my-1'>
                    <Text className='text-lg font-semibold '>{item.addressName}</Text>
                    <Text>{item.placeName}</Text>
                </View>
            </Pressable>
        )
    }

    const renderSuggestion = (item: any) => {
        return (
            <Pressable
                disabled={loading}
                onPress={async () => {
                    try {
                        setLoading(true)
                        setLoadingItem(item.description)
                        const response = await getLongAndLat({ placeId: item.placeId });
                        dispatch(setLocationCopy({
                            latitude: response.data.latitude,
                            longitude: response.data.longitude,
                        }))
                        //@ts-ignore
                        navigation.navigate("Location Information")
                    } catch (error) {
                        Alert.alert("Error")
                        console.log(error);

                    } finally {
                        setLoading(false)
                    }
                }}>
                <View className='bg-white rounded-lg mb-2 border-solid border-[1px] border-gray-300 shadow-md h-14'>
                    <View className='p-2 w-full flex flex-row gap-2'>
                        <Icon className='self-center text-red-500 w-8' size={6} as={<Entypo name="location" size={24} color="black" />} />
                        <Text numberOfLines={2} className='font-normal text-gray-700 w-3/4 leading-5 tracking-wide self-center'>{item.description}</Text>
                        {loading && loadingItem === item.description ? (
                        <View className='flex justify-center'>
                            <Spinner color="rgb(55,65,81)" />
                        </View>
                        ) : (
                        <Text></Text>
                        )}
                    </View>
                </View>
                {/* <Divider /> */}
            </Pressable>
        );
    };

    return (
        <View style={styles.container} className='h-screen'>
            <Input
                value={queryy}
                onChangeText={handleQueryChange}
                placeholder="Enter a location"
                className='placeholder:text-lg font-semibold'
                style={{ borderColor: "white" }}
                InputRightElement={queryy ? <Icon
                    onPress={() => setQuery("")}
                    as={<Entypo name="circle-with-cross" size={24} color="black" />}
                    className='text-gray-400 mr-3'
                /> : <Text></Text>}
                InputLeftElement={<Icon as={<AntDesign name="search1" size={24} color="black" />} className='text-gray-400 ml-3' />}
                backgroundColor="#F3F4F6FF"
            />
            {
                suggestions.length > 0 ? (
                    <FlatList
                        keyboardShouldPersistTaps='always' //open keyboard
                        data={suggestions}
                        renderItem={({ item }) => renderSuggestion(item)}
                        keyExtractor={(item) => item.description}
                        className='mt-3'
                    />
                ) : (
                    <View className='h-screen mt-5'>
                        <Pressable
                            disabled={loading}
                            onPress={async () => {
                                try {
                                    setLoading(true)
                                    let { status } = await Location.requestForegroundPermissionsAsync();
                                    if (status !== 'granted') {
                                        Alert.alert(
                                            'Permission Denied',
                                            'Permission to access location was denied',
                                            [{ text: 'OK' }]
                                        );
                                        return;
                                    }
                                    let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
                                    const { latitude, longitude } = currentLocation.coords;
                                    const addMessage = Firebase.functions().httpsCallable('addMessage');
                                    const coordinates = {
                                        latitude,
                                        longitude
                                    }
                                    const res = await addMessage(coordinates)
                                    if (res.data.name) {
                                        const closestAddress  = findClosest(coordinates, addresses)
                                    
                                    console.log("closest Address",closestAddress); 

                                    

                                    const closestDistance = geoDistance(coordinates, closestAddress.location);
                                    console.log("closest distance",closestDistance);
                                    if(closestDistance <= 100){
                                        dispatch(setPlaceName(closestAddress.addressName))
                                        dispatch(setLocation(closestAddress.location))
                                        
                                    }
                                    else{dispatch(setPlaceName("not granted"))
                                    dispatch(setLocation({
                                        latitude: latitude,
                                        longitude: longitude
                                    }))}
                                        //@ts-ignore
                                        navigation.navigate("Home")
                                    } else {
                                        Alert.alert("Error fetching location try again")
                                    }
                                } catch (error) {
                                    Alert.alert("Error getting location try again")
                                } finally {
                                    setLoading(false)
                                }
                            }}>
                            <View className='flex flex-row gap-3'>
                                <Icon
                                    size={5}
                                    className={loading ? 'self-center text-red-200' : 'self-center text-red-500'}
                                    as={<MaterialIcons name="my-location" size={24} color="black" />}
                                />
                                <View>
                                        <Text className={loading ?'text-xl text-red-200 font-semibold':'text-xl text-red-500 font-semibold'}>{loading ? "Fetching location" : "Current location"}</Text>
                                    <Text className='text-md text-red-300'>Using GPS</Text>
                                </View>
                            </View>
                            </Pressable>
                            <View className='mt-5'>
                                <FlatList
                                    keyboardShouldPersistTaps='always' //open keyboard
                                    data={addresses}
                                    renderItem={({ item }) => renderAddressSuggestion(item)}
                                    keyExtractor={(item) => item.id}
                                    className='mt-3'
                                />
                            </View>
                    </View>
                )
            }
        </View>
    );
};

export default LocationAutocomplete;

const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    input: {
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    suggestionContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    suggestionText: {
        fontSize: 16,
    },
});

// const NativeSpliner = ({ loading, item, suggestions }: {
//     loading: boolean
//     item: any
//     suggestions: any[]
// }) => {
//     console.log(suggestions.find(one => one.description === item.description));

//     return (
        
//     )
// }