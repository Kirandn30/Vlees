import { Badge, Box, Button, CheckIcon, Divider, Drawer, FormControl, Icon, Input, Select, Text, VStack, View } from "native-base";
import { Alert, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Ionicons } from '@expo/vector-icons';
import { setLocation, setPlaceName } from "../redux/Mapslice";
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
    const { location, placeName } = useSelector((state: RootState) => state.Location)
    const [currentAdress, setCurrentAdress] = useState<null | string>(null)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const nativate = useNavigation()
    const { User } = useSelector((state: RootState) => state.User)

    // const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const onRegionChangeComplete = (newRegion: any) => {
        dispatch(setLocation(newRegion));
    };

    useEffect(() => {
        (async () => {
            if (!location) return
            const addMessage = Firebase.functions().httpsCallable('addMessage');
            const coordinates = {
                latitude: location.latitude,
                longitude: location.longitude
            }
            const res = await addMessage(coordinates)
            dispatch(setPlaceName(res.data.name))
            if (res.data.name) {
                setCurrentAdress(res.data.name)
            } else {
                Alert.alert("Error fetching location try again")
            }
        })()
    }, [location])

    const handleSubmit = (values: FormValues) => {
        if (!User) return
        setLoading(true)
        Firebase.firestore().collection("Address").add({
            ...values,
            userId: User.uid,
            location, placeName
        }).then(() => {
            setIsOpen(false)
            //@ts-ignore
            nativate.navigate('Home')
            dispatch(setPlaceName(values.addressName))
        }).finally(() => setLoading(false))

    };

    return (
        <View className="h-screen">
            {location && (
                <View className='relative'>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        onRegionChangeComplete={onRegionChangeComplete}
                        minZoomLevel={18}
                        showsMyLocationButton
                        showsUserLocation
                        showsBuildings
                    />
                    <View style={styles.marker} >
                        <View className="w-28 bg-black m-auto px-1 py-2 rounded-lg absolute bottom-9 -right-10">
                            <Text className="text-white text-xs text-center">Move the map to adjust your location</Text>
                        </View>
                        <Icon color="red.500" size={8} as={<Ionicons name="ios-location-sharp" size={24} color="black" />} />
                    </View>
                    {/* <View className="rounded-full p-2 absolute right-5 bottom-56 bg-white border-solid border-gray-200 border-[1px]">
                        <Icon
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
                                        dispatch(setPlaceName(res.data.name))
                                        dispatch(setLocation({
                                            latitude: latitude,
                                            longitude: longitude
                                        }))
                                    } else {
                                        Alert.alert("Error fetching location try again")
                                    }
                                } catch (error) {
                                    Alert.alert("Error getting location try again")
                                    console.log(error);

                                } finally {
                                    setLoading(false)
                                }
                            }}
                            className={loading ? "text-blue-400" : "text-blue-700"}
                            size={8}
                            as={<MaterialIcons name="my-location" size={24} color="black" />}
                        />
                    </View> */}
                    <View className="absolute block bottom-14 bg-white p-5 w-full">
                        <Text className="font-semibold">{currentAdress}</Text>
                        <ButtonCompo
                            handelClick={() => {
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
                <Text className="w-4/5">{currentAdress}</Text>
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
                                <ButtonCompo
                                    loading={loading} text={"Add address"} disable={loading} handelClick={handleSubmit} />
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