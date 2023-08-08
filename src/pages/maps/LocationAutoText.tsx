import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, ScrollView, Pressable, Alert } from 'react-native';
import { debounce } from 'lodash';
import { db,func } from '../../../config';
import { Divider, Icon, Input, Spinner, AlertDialog, Button, IconButton, Drawer } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { setAddresses, setLocation, setLocationCopy, setPlaceName, updateAddress } from '../../redux/Mapslice';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { RootState } from '../../redux';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { findClosest, geoDistance } from '../../services/distance';
import { clearCart } from '../../redux/CartSlice';
import { httpsCallable } from 'firebase/functions';
import { Form, FormValues } from '../../components/MapComponent'

interface LocationAutocompleteProps { }


const getLocationSuggestions = httpsCallable(func,'getLocationSuggestions');
const getLongAndLat = httpsCallable(func,'getLongAndLat');

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = () => {
    const [queryy, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState<string|null>(null)
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { User } = useSelector((state: RootState) => state.User)
    const { addresses, placeName } = useSelector((state: RootState) => state.Location)
    const [isOpen,setIsOpen] = useState(false)
    const [selectedAddress,setSelectedAddress] = useState<any>(null)
    const onClose = () => setIsOpen(false);
    const [type, setType] = useState<"new"|"prev"|"fetch">("prev")
    const [openEdit, setOpenEdit] = useState(false)

  const cancelRef = React.useRef(null);

  const handleSubmit = async() => {
    if (type === "prev") {
    dispatch(setPlaceName(selectedAddress.addressName))
    dispatch(setLocation(selectedAddress.location))
    dispatch(clearCart())
    onClose()
    //@ts-ignore
    navigation.navigate('Home')
    }
    else if (type === "fetch") {
        onClose()
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
            const addMessage = httpsCallable(func,'addMessage');
            const coordinates = {
                latitude,
                longitude
            }
            const res = await addMessage(coordinates)
            console.log("res",res)
            if (res.data.name) {
                if(addresses.length > 0){
                    const closestAddress  = findClosest(coordinates, addresses)
                    console.log("closest Address",closestAddress); 
                    const closestDistance = geoDistance(coordinates, closestAddress.location);
                    console.log("closest distance",closestDistance);
                    if(closestDistance <= 100){
                        dispatch(setPlaceName(closestAddress.addressName))
                        dispatch(setLocation(closestAddress.location))
                        
                    }
                    else{
                        dispatch(setPlaceName("not granted"))
                        dispatch(setLocation({
                            latitude: latitude,
                            longitude: longitude
                        }))
                    }

                    
                }
                else{
                    dispatch(setPlaceName("not granted"))
                    dispatch(setLocation({
                        latitude: latitude,
                        longitude: longitude
                    }))

                }
            
                //@ts-ignore
                navigation.navigate("Home")
            } else {
                Alert.alert("Error fetching location try again")
            }
        } catch (error) {
            console.log("err",error)
            Alert.alert("Error getting location try again")
        } finally {
            setLoading(false)
        }
    }
    else{
        try {
            onClose()
            setLoading(true)
            setLoadingItem(selectedAddress.description)
            const response = await getLongAndLat({ placeId: selectedAddress.placeId });
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
    }

    }

    const handleSubmitEdit = (values: FormValues) => {
        console.log(values)
        if (!User) return
        setLoading(true)
        updateDoc(doc(db,"Address",selectedAddress.id),{
            ...selectedAddress,...values
        }).finally(() => {
            dispatch(updateAddress({...selectedAddress,...values}))
            setLoading(false)
            setOpenEdit(false)
        })

    }

    const handleQueryChange = (text: string) => {
        setQuery(text);
    };

    useEffect(() => {
        if (!User) return
        const unsub = onSnapshot(query(collection(db, "Address"), where("userId", "==", User.uid)), (snap) => {
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
                setType("prev")
                if(placeName!=item.addressName){
                    setSelectedAddress(item)
                    setIsOpen(true)
                }
                else{
                    //@ts-ignore
                    navigation.navigate('Home')
                }
                //dispatch(setPlaceName(item.addressName))
                //dispatch(setLocation(item.location))
                //@ts-ignore
                //
            }}>
                <View className='p-3 py-1 border-solid border-[1px] border-gray-300 rounded-lg space-x-1 items-center bg-white my-1 flex flex-row'>
                    <View className='w-[80%]'>
                        <Text className='text-lg font-semibold '>{item.addressName}</Text>
                        <Text>{item.placeName}</Text>
                    </View>
                    <View>
                        <IconButton onPress={() => {
                        console.log("delete")
                        setSelectedAddress(item)
                        setOpenEdit(true)
                    }} icon={<Icon as={<AntDesign name="edit" size={24} color="black" />} />} />
                    </View>
                </View>
                
            </Pressable>
        )
    }

    const renderSuggestion = (item: any) => {
        return (
            <Pressable
                disabled={loading}
                onPress={async () => {
                    setType("new")
                    setSelectedAddress(item)
                    setIsOpen(true)
                    /* try {
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
                    } */
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
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Warning: Address Change Will Empty Cart</AlertDialog.Header>
                    <AlertDialog.Body>
                        Please note that changing your address will result in a change of outlet, which will empty your cart. To proceed, click the "Confirm" button.
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                        <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                            Cancel
                        </Button>
                        <Button colorScheme="danger" onPress={handleSubmit}>
                            Confirm
                        </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>

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
                                setType("fetch")
                                setIsOpen(true)
                               
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
            <Drawer
                    children={<Form
                        currentAdress={selectedAddress}
                        handleSubmit={handleSubmitEdit}
                        loading={loading}
                    />}
                    onClose={() => {
                        setSelectedAddress(null)
                        setOpenEdit(false)}}
                    placement="bottom"
                    isOpen={openEdit}
                />
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