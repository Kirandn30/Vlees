import React from 'react';
import { Platform, SafeAreaView } from "react-native"
import {
    VStack,
    HStack,
    FormControl,
    Input,
    TextArea,
    Select,
    ScrollView,
    View,
    Text,
    KeyboardAvoidingView
} from 'native-base';
import { Formik } from 'formik';
import * as yup from 'yup';
import RoundImageButton from './AvatarCompo';
import ButtonCompo from '../../components/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    businessName: yup.string().required('Business Name is required'),
    phoneNumber: yup
        .string()
        .required('Phone Number is required')
        .matches(/^\d{10}$/, 'Phone Number must be 10 digits'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    address: yup.string().required('Address is required'),
    pincode: yup.string().required('Pincode is required').length(6, 'Pincode must be 6 digits'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    gstNumber: yup
        .string()
        .required('GST Number is required')
        .length(11, 'GST Number must be 11 characters'),
});

const ProfileForm = ({
    onSave, setImage, image, loading }: any) => {

    const { userDetails } = useSelector((state: RootState) => state.User)

    return (
        <ScrollView pagingEnabled className={userDetails ? 'pb-9' : 'pb-9'}>
            <KeyboardAvoidingView
            // behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Formik
                    initialValues={{
                        name: userDetails ? userDetails.name : '',
                        businessName: userDetails ? userDetails.businessName : '',
                        phoneNumber: userDetails ? userDetails.phoneNumber : '',
                        email: userDetails ? userDetails.email : '',
                        address: userDetails ? userDetails.address : '',
                        pincode: userDetails ? userDetails.pincode : '',
                        city: userDetails ? userDetails.city : '',
                        state: userDetails ? userDetails.state : '',
                        gstNumber: userDetails ? userDetails.gstNumber : '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSave}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setValues }) => {
                        return (
                            <VStack space={4} mt={4}>
                                {!userDetails && <HStack h="1/6" bg="gray.200" className='flex justify-center items-center'>
                                    <View>
                                        <RoundImageButton setImage={setImage} image={image} />
                                    </View>
                                </HStack>}
                                <View className='p-4'>
                                    <FormControl isInvalid={Boolean(errors.name && touched.name)}>
                                        <FormControl.Label>Name</FormControl.Label>
                                        <Input
                                            value={values.name}
                                            onChangeText={handleChange('name')}
                                        />
                                        <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={Boolean(errors.businessName && touched.businessName)}>
                                        <FormControl.Label>Business Name</FormControl.Label>
                                        <Input
                                            value={values.businessName}
                                            onChangeText={handleChange('businessName')}
                                        />
                                        <FormControl.ErrorMessage>{errors.businessName}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={Boolean(errors.phoneNumber && touched.phoneNumber)}>
                                        <FormControl.Label>Phone Number</FormControl.Label>
                                        <Input
                                            value={values.phoneNumber}
                                            onChangeText={handleChange('phoneNumber')}
                                            onBlur={handleBlur('phoneNumber')}
                                            keyboardType="phone-pad"
                                        />
                                        <FormControl.ErrorMessage>{errors.phoneNumber}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={Boolean(errors.email && touched.email)}>
                                        <FormControl.Label>Email</FormControl.Label>
                                        <Input
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            keyboardType="email-address"
                                        />
                                        <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={Boolean(errors.address && touched.address)}>
                                        <FormControl.Label>Address</FormControl.Label>
                                        <TextArea
                                            value={values.address}
                                            onChangeText={handleChange('address')}
                                            autoCompleteType={undefined} />
                                        <FormControl.ErrorMessage>{errors.address}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={Boolean(errors.pincode && touched.pincode)}>
                                        <FormControl.Label>Pincode</FormControl.Label>
                                        <Input
                                            value={values.pincode}
                                            onChangeText={handleChange('pincode')}
                                            keyboardType="number-pad"
                                        />
                                        <FormControl.ErrorMessage>{errors.pincode}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={Boolean(errors.city && touched.city)}>
                                        <FormControl.Label>City</FormControl.Label>
                                        <Input
                                            value={values.city}
                                            onChangeText={handleChange('city')}
                                        />
                                        <FormControl.ErrorMessage>{errors.city}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={Boolean(errors.state && touched.state)}>
                                        <FormControl.Label>State</FormControl.Label>
                                        <Select
                                            placeholder="Select a state"
                                            selectedValue={values.state}
                                            onValueChange={handleChange('state')}
                                            _selectedItem={{
                                                bg: 'gray.200',
                                                endIcon: <Text>✔</Text>,
                                                borderRadius: "xl",
                                                color: "blue.100"
                                            }}
                                        >
                                            {states.map((state, index) => (
                                                <Select.Item key={index} label={state.label} value={state.value} />
                                            ))}
                                        </Select>
                                        <FormControl.ErrorMessage>{errors.state}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={Boolean(errors.gstNumber && touched.gstNumber)}>
                                        <FormControl.Label>GST Number</FormControl.Label>
                                        <Input
                                            value={values.gstNumber}
                                            onChangeText={handleChange('gstNumber')}
                                            maxLength={11}
                                            keyboardType="default"
                                        />
                                        <FormControl.ErrorMessage>{errors.gstNumber}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <View className='mt-3'>
                                        <ButtonCompo
                                            handelClick={handleSubmit}
                                            text={userDetails ? 'Update' : 'Confirm'}
                                            disable={false}
                                            loading={loading}
                                        />
                                    </View>
                                </View>
                            </VStack>
                        )
                    }}
                </Formik>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default ProfileForm;

const states = [
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
    { label: 'Assam', value: 'Assam' },
    { label: 'Bihar', value: 'Bihar' },
    { label: 'Chhattisgarh', value: 'Chhattisgarh' },
    { label: 'Goa', value: 'Goa' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Haryana', value: 'Haryana' },
    { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
    { label: 'Jharkhand', value: 'Jharkhand' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Kerala', value: 'Kerala' },
    { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Manipur', value: 'Manipur' },
    { label: 'Meghalaya', value: 'Meghalaya' },
    { label: 'Mizoram', value: 'Mizoram' },
    { label: 'Nagaland', value: 'Nagaland' },
    { label: 'Odisha', value: 'Odisha' },
    { label: 'Punjab', value: 'Punjab' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'Sikkim', value: 'Sikkim' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'Telangana', value: 'Telangana' },
    { label: 'Tripura', value: 'Tripura' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'Uttarakhand', value: 'Uttarakhand' },
    { label: 'West Bengal', value: 'West Bengal' }
];