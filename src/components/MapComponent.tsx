import { Badge, Box, Button, CheckIcon, Divider, Drawer, FormControl, Icon, Input, Select, Text, VStack, View } from "native-base";
import { Alert, StyleSheet } from "react-native";
import Lottie from 'lottie-react-native';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from '@expo/vector-icons';
import { setLocation, setLocationCopy, setPlaceName } from "../redux/Mapslice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux";
import { useEffect, useRef, useState } from "react";
import { Firebase } from "../../config";
import ButtonCompo from "./button";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Yup from "yup"
import { Formik } from "formik";
import React from "react";

export const MapComponent = () => {
    const { locationCopy, placeName, location } = useSelector((state: RootState) => state.Location)
    const [currentAdress, setCurrentAdress] = useState<null | string>(null)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const nativate = useNavigation()
    const { User } = useSelector((state: RootState) => state.User)
    const [deliverable, setDeliverable] = useState(true)

    // const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [liveLocationFromMap, setLiveLocationFromMap] = useState<any>()
    const onRegionChangeComplete = (newRegion: any) => {
        setLiveLocationFromMap(newRegion)
        dispatch(setLocationCopy(newRegion))
    };

    useEffect(() => {
        (async () => {
            if (!locationCopy) return
            const addMessage = Firebase.functions().httpsCallable('addMessage');
            const coordinates = {
                latitude: locationCopy.latitude,
                longitude: locationCopy.longitude
            }
            const res = await addMessage(coordinates)
            if (res.data.name) {
                // dispatch(setPlaceName(res.data.name))
                setCurrentAdress(res.data.name)
            } else {
                Alert.alert("Error fetching location try again")
            }
        })()
    }, [locationCopy]) 

    const handleSubmit = (values: FormValues) => {
        if (!User) return
        setLoading(true)
        console.log(location);

        Firebase.firestore().collection("Address").add({
            ...values,
            userId: User.uid,
            location: location,
            placeName: currentAdress
        }).then(() => {
            setIsOpen(false)
            //@ts-ignore
            nativate.navigate('Home')
            dispatch(setPlaceName(values.addressName))
        }).finally(() => setLoading(false))

    };

    useEffect(() => {
        setLiveLocationFromMap(locationCopy)
    }, [])

    if (deliverable) {
        return (
            <View className="h-screen">
                {locationCopy && (
                    <View className='relative'>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: locationCopy.latitude,
                                longitude: locationCopy.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            onRegionChangeComplete={onRegionChangeComplete}
                            minZoomLevel={18}
                            showsMyLocationButton
                            showsUserLocation
                            provider={PROVIDER_GOOGLE}
                        />
                        <View style={styles.marker} >
                            <View className="w-28 bg-black m-auto px-1 py-2 rounded-lg absolute bottom-9 -right-10">
                                <Text className="text-white text-xs text-center">Move the map to adjust your location</Text>
                            </View>
                            <Icon color="red.500" size={8} as={<Ionicons name="ios-location-sharp" size={24} color="black" />} />
                        </View>
                        <View className="absolute block bottom-14 bg-white p-5 w-full">
                            <Text className="font-semibold mb-5">{currentAdress}</Text>
                            <ButtonCompo
                                handelClick={() => {
                                    const withIn = isWithinHyderabadBoundaries(locationCopy.latitude, locationCopy.longitude)
                                    setDeliverable(withIn);
                                    if (!withIn) return
                                    dispatch(setLocation(liveLocationFromMap));
                                    setIsOpen(!isOpen);
                                }}
                                text="Confim & Continue"
                                loading={false}
                                disable={false}
                            />
                        </View>
                    </View>
                )}
                <Drawer
                    children={<Form
                        currentAdress={currentAdress}
                        handleSubmit={handleSubmit}
                        loading={loading}
                    />}
                    onClose={() => setIsOpen(false)}
                    placement="bottom"
                    isOpen={isOpen}
                />
            </View>
        );   
    } else {
        return (
            <View className="h-screen flex-row justify-center items-center">
                <View>
                    <Lottie source={require('../../assets/not-found.json')} autoPlay loop style={{ height: 300 }} />
                    <Text className="text-center font-bold text-lg text-gray-500">No Outlets found near you</Text>
                </View>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    map: {
        minHeight: "100%"
    },
    marker: {
        left: '50%',
        marginLeft: -12,
        marginTop: -36,
        position: 'absolute',
        top: '50%',
    },
});


const Form = ({ currentAdress, handleSubmit, loading }: {
    currentAdress: string | null
    handleSubmit: (values: FormValues) => void
    loading: boolean
}) => {

    return (
        <View>
            <View className="py-2 flex flex-row gap-1 bg-gray-100 px-3">
                <Text className="w-4/5 font-semibold">{currentAdress}</Text>
                <Badge className="rounded-3xl bg-gray-200 self-center">Change</Badge>
            </View>
            <View className="bg-white p-3">
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <Box>
                            <VStack space={1} width="90%" mx="auto">
                                <FormControl isInvalid={Boolean(errors.houseFlatNo) && touched.contactNumber}>
                                    <FormControl.Label>House/Flat No</FormControl.Label>
                                    <Input
                                        onBlur={handleBlur('houseFlatNo')}
                                        onChangeText={handleChange('houseFlatNo')}
                                        value={values.houseFlatNo}
                                    />
                                    <FormControl.ErrorMessage>{errors.houseFlatNo}</FormControl.ErrorMessage>
                                </FormControl>

                                {/* <FormControl isInvalid={Boolean(errors.floorNumber)}>
                                    <FormControl.Label>Floor Number</FormControl.Label>
                                    <Input
                                        onBlur={handleBlur('floorNumber')}
                                        onChangeText={handleChange('floorNumber')}
                                        value={values.floorNumber}
                                    />
                                    <FormControl.ErrorMessage>{errors.floorNumber}</FormControl.ErrorMessage>
                                </FormControl> */}

                                <FormControl isInvalid={Boolean(errors.buildingName) && touched.contactNumber}>
                                    <FormControl.Label>Building/Apartment Name</FormControl.Label>
                                    <Input
                                        onBlur={handleBlur('buildingName')}
                                        onChangeText={handleChange('buildingName')}
                                        value={values.buildingName}
                                    />
                                    <FormControl.ErrorMessage>{errors.buildingName}</FormControl.ErrorMessage>
                                </FormControl>

                                {/* <FormControl isInvalid={Boolean(errors.howToReach) && touched.howToReach}>
                                    <FormControl.Label>How to Reach</FormControl.Label>
                                    <Input
                                        onBlur={handleBlur('howToReach')}
                                        onChangeText={handleChange('howToReach')}
                                        value={values.howToReach}
                                    />
                                    <FormControl.ErrorMessage>{errors.howToReach}</FormControl.ErrorMessage>
                                </FormControl> */}

                                <FormControl isInvalid={Boolean(errors.contactNumber) && touched.contactNumber}>
                                    <FormControl.Label>Contact Number</FormControl.Label>
                                    <Input
                                        keyboardType="numeric"
                                        onBlur={handleBlur('contactNumber')}
                                        onChangeText={handleChange('contactNumber')}
                                        value={values.contactNumber}
                                    />
                                    <FormControl.ErrorMessage>{errors.contactNumber}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={Boolean(errors.addressName) && touched.addressName}>
                                    <FormControl.Label>Address Name</FormControl.Label>
                                    <Input
                                        onBlur={handleBlur('addressName')}
                                        onChangeText={handleChange('addressName')}
                                        value={values.addressName}
                                    />
                                    <FormControl.ErrorMessage>{errors.addressName}</FormControl.ErrorMessage>
                                </FormControl>
                                <View className="mt-3">
                                    <ButtonCompo
                                        loading={loading} text={"Add address"} disable={loading} handelClick={handleSubmit} />
                                </View>
                            </VStack>
                        </Box>
                    )}
                </Formik>
            </View>
        </View>
    );
};


type FormValues = {
    houseFlatNo: string;
    // floorNumber: string;
    buildingName: string;
    // howToReach: string;
    contactNumber: string;
    addressName: string
};

const validationSchema = Yup.object().shape({
    houseFlatNo: Yup.string().required('Required'),
    // floorNumber: Yup.string().required('Required'),
    buildingName: Yup.string().required('Required'),
    // howToReach: Yup.string().required('Required'),
    contactNumber: Yup.string().required('Required'),
    addressName: Yup.string().required('Required'),
});
const initialValues: FormValues = {
    houseFlatNo: '',
    // floorNumber: '',
    buildingName: '',
    // howToReach: '',
    contactNumber: '',
    addressName: '',
};


const isWithinHyderabadBoundaries = (latitude: number, longitude: number) => {
    const hyderabadBounds = {
        southwest: {
            lat: 17.1889,
            lng: 78.3055,
        },
        northeast: {
            lat: 17.5778,
            lng: 78.6219,
        },
    };

    return (
        latitude >= hyderabadBounds.southwest.lat &&
        latitude <= hyderabadBounds.northeast.lat &&
        longitude >= hyderabadBounds.southwest.lng &&
        longitude <= hyderabadBounds.northeast.lng
    );
};
