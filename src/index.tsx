import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setUserDetails } from './redux/UserSlice'
import { RootState } from './redux'
import UserDetails from './pages/userDetails'
import FirebaseOTP from './pages/Auth'
import { Avatar, Button, StatusBar } from 'native-base'
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home'
import { Keyboard } from 'react-native'
import ProfileManagment from './components/ProfileManagment'
import GetLocation, { openAppSettings } from './components/GetLocation'
import GetLocationDetails from './pages/maps'
import GoBack from './components/GoBack'
import LocationInfo from './pages/maps/LocationInfo'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Orders from './pages/Orders'
import Cart from './pages/Cart'
import Profile from './pages/profile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsCompo from './pages/TermsCompo'
import AboutPage from './pages/AboutPage'
import FeedBack from './pages/FeedBack'
import MangageAddress from './pages/MangageAddress'
import { setAddresses, setFetchingLocation } from './redux/Mapslice'
import SingleOrder from './pages/Orders/SingleOrder'
import SlotBook from './pages/Slot'
import ButtomNavBar from './components/ButtomNavBar'
import { navigationRef } from './components/RootNavigation'
import { TransitionSpecs } from '@react-navigation/stack';
import ProductPage from './components/ProductPage'
import * as IntentLauncher from 'expo-intent-launcher';
import { getCurrentPositionAsync, Accuracy, requestForegroundPermissionsAsync } from 'expo-location';
import { Firebase } from '../config';
import { setLocation, setPlaceName } from './redux/Mapslice';
import { FetchLocation } from './components/FetchLocation'
import ShowCartDetails from './components/ShowCartDetails'
import GetHelpOrder from './components/GetHelpOrder'
import Geolocation from '@react-native-community/geolocation';


const Pages = () => {
    const Stack = createStackNavigator();
    const { User, userDetails } = useSelector((state: RootState) => state.User)
    const { CategoryName } = useSelector((state: RootState) => state.Listings)
    const { fetchinglocation, placeName } = useSelector((state: RootState) => state.Location)
    const { getHelpOrderData } = useSelector((state: RootState) => state.Orders)

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsub = Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                dispatch(setUser(user))
                dispatch(setPlaceName("fetch"))
                Firebase.firestore().collection("Address").where("userId", "==", user.uid).get()
                    .then((res) => {
                        dispatch(setAddresses(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
                    })
            } else {
                dispatch(setUser(null))
            }
        })
        return () => unsub();
    }, [])

    useEffect(() => {
        if (placeName === "fetch") {
            dispatch(setFetchingLocation(true))
        } else {
            dispatch(setFetchingLocation(false))
        }
    }, [placeName])

    useEffect(() => {
        if (!User) return
        Firebase.firestore().collection("Users").doc(User.uid).get().then((response) => {
            if (response.exists) {
                dispatch(setUserDetails(response.data()))
                setLoading(false);
            } else {
                dispatch(setUserDetails(null))
                setLoading(false);
            }
        }).catch((error) => {
            console.log(error);
        })
    }, [User])


    if (loading && !userDetails && User) {
        return (<View className='flex-1 justify-center items-center bg-white'>
            <Text className='text-xl font-semibold'>Loading......</Text>
        </View>);
    }

    const getLocFunc = () => {
        console.log("1");
        requestForegroundPermissionsAsync()
            .then(({ status }) => {
                if (status !== 'granted') {
                    Alert.alert(
                        'Permission Denied',
                        'Permission to access location was denied',
                        [{ text: 'Give Access', onPress: openAppSettings }]
                    );
                    dispatch(setPlaceName("not granted"))
                    return;
                }
                console.log("2");
                getCurrentPositionAsync({
                    accuracy: Accuracy.Balanced,
                })
                    .then((currentLocation) => {
                        const { latitude, longitude } = currentLocation.coords;
                        const addMessage = Firebase.functions().httpsCallable('addMessage');
                        const coordinates = {
                            latitude,
                            longitude
                        }
                        console.log("3");
                        addMessage(coordinates)
                            .then((res) => {
                                if (res.data.name) {
                                    dispatch(setPlaceName(res.data.name))
                                    dispatch(setLocation({
                                        latitude: latitude,
                                        longitude: longitude
                                    }))
                                    console.log('4');
                                } else {
                                    Alert.alert("Error fetching location try again")
                                }
                            })
                            .catch((error) => {
                                console.log(error);

                            })
                    })
                    .catch((error) => {
                        console.log(error);

                    })
            }).catch((error) => {
                console.log(error);

            })
    }


    if (fetchinglocation) {
        return (
            <FetchLocation getLocFunc={getLocFunc} />
        )
    } else {
    if (User && userDetails) {
        return (
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: true,
                        gestureEnabled: true,
                        gestureDirection: 'horizontal',
                        cardStyleInterpolator: ({ current }) => {
                            return {
                                cardStyle: {
                                    transform: [
                                        {
                                            translateX: current.progress.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1000, 0],
                                            }),
                                        },
                                    ],
                                },
                            };
                        },
                    }}
                >
                    <Stack.Screen
                        name='Home'
                        component={Home}
                        options={{
                            headerRight: () => (<ProfileManagment />),
                            headerLeft: () => (<GetLocation />),
                            headerTitle: "",
                            headerStyle: { shadowColor: " 1px 12px 10px -4px rgba(0,0,0,0.7 5)" },
                        }}
                    />
                    <Stack.Screen
                        name='Your Location'
                        component={GetLocationDetails}
                        options={{
                            headerLeft: () => (<GoBack />),
                        }}

                    />
                    <Stack.Screen
                        name='Location Information'
                        component={LocationInfo}
                        options={{
                            headerLeft: () => (<GoBack />),
                        }}
                    />
                    <Stack.Screen
                        name='Cart'
                        component={Cart}
                        options={{
                            headerLeft: () => (<GoBack />),
                        }}
                    />
                    <Stack.Screen
                        name='Orders'
                        component={Orders}
                        options={{
                            headerLeft: () => (<GoBack />),
                        }}
                    />
                    <Stack.Screen
                        name='Contact'
                        component={Contact}
                        options={{
                            headerLeft: () => (<GoBack />),
                        }}
                    />
                    <Stack.Screen
                        name='Privacy'
                        component={PrivacyPolicy}
                        options={{
                            headerLeft: () => (<GoBack />),
                            headerTitle: "",
                            headerStyle: { shadowColor: " 1px 12px 10px -4px rgba(0,0,0,0.7 5)" },
                        }}
                    />
                    <Stack.Screen
                        name='Terms'
                        component={TermsCompo}
                        options={{
                            headerLeft: () => (<GoBack />),
                            headerTitle: "",
                            headerStyle: { shadowColor: " 1px 12px 10px -4px rgba(0,0,0,0.7 5)" },
                        }}
                    />
                    <Stack.Screen
                        name='About'
                        component={AboutPage}
                        options={{
                            headerLeft: () => (<GoBack />),
                            headerTitle: "",
                            headerStyle: { shadowColor: " 1px 12px 10px -4px rgba(0,0,0,0.7 5)" },
                        }}
                    />
                    <Stack.Screen
                        name='Feedback'
                        component={FeedBack}
                        options={{
                            headerLeft: () => (<GoBack />),
                            headerTitle: "",
                            headerStyle: { shadowColor: " 1px 12px 10px -4px rgba(0,0,0,0.7 5)" },
                        }}
                    />
                    <Stack.Screen
                        name='SlotBook'
                        component={SlotBook}
                        options={{
                            headerLeft: () => (<GoBack />),
                            headerTitle: "Schedule",
                            headerStyle: { shadowColor: " 1px 12px 10px -4px rgba(0,0,0,0.7 5)" },
                        }}
                    />
                    <Stack.Screen
                        name='ProductPage'
                        //@ts-ignore
                        component={ProductPage}
                        options={{
                            headerLeft: () => (<GoBack />),
                            headerTitle: CategoryName ? CategoryName : "",
                            headerStyle: { shadowColor: " 1px 12px 10px -4px rgba(0,0,0,0.7 5)" },
                        }}
                    />
                    <Stack.Screen
                        name='ManageAddress'
                        component={MangageAddress}
                        options={{
                            headerLeft: () => (<GoBack />),
                            headerTitle: "",
                            headerStyle: { shadowColor: " 1px 12px 10px -4px rgba(0,0,0,0.7 5)" },
                        }}
                    />
                    <Stack.Screen
                        name='Products'
                        //@ts-ignore
                        component={Products}
                        options={{
                            headerRight: () => (<ProfileManagment />),
                            headerLeft: () => (<GoBack />),
                            headerTitle: CategoryName ? CategoryName : "Products"
                        }}
                    />
                    <Stack.Screen
                        name='OrderId'
                        //@ts-ignore
                        component={SingleOrder}
                        options={{
                            headerLeft: () => (<GoBack />),
                            headerRight: () => (<GetHelpOrder getHelpOrderData={getHelpOrderData} />),
                            headerTitle: "Order"
                        }}
                    />
                    <Stack.Screen
                        name='Profile'
                        //@ts-ignore
                        component={Profile}
                        options={{
                            headerRight: () => (<Button variant="unstyled" onPress={() => Firebase.auth().signOut()}>
                                <Text className='text-red-600'>Logout</Text>
                            </Button>),
                            headerLeft: () => (<GoBack />),
                            headerTitle: 'My Profile'
                        }}
                    />
                </Stack.Navigator>
                <View>
                    <ShowCartDetails />
                    <ButtomNavBar Stack={Stack} />
                </View>
            </NavigationContainer>
        )
    } else if (User && !userDetails) {
        return (<View className="min-h-screen bg-white">
            <UserDetails />
        </View>)
    } else {
        return (
            <View className="bg-white">
                <FirebaseOTP />
            </View>
        )
    }
    }
}

export default Pages
