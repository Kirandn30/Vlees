import React from 'react';
import { Platform, SafeAreaView, } from "react-native"
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
    KeyboardAvoidingView,
    
} from 'native-base';
import { Formik } from 'formik';
import * as yup from 'yup';
import RoundImageButton from './AvatarCompo';
import ButtonCompo from '../../components/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

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
        <ScrollView >
            
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
                            <VStack space={4} mt={4} className="mb-20">
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
                                        <AutocompleteDropdown
                                           closeOnBlur={true}
                                           closeOnSubmit={true}
                                           initialValue={values.state}
                                           onSelectItem={(item) => item?.id && setValues({...values, state: item.id})}
                                           dataSet={states}
                                           inputContainerStyle={{borderWidth: 1,borderColor:'#dddddd',backgroundColor:'transparent'}} 
                                        />
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
                
        </ScrollView>
    );
};

export default ProfileForm;

const states = [
    { title: 'Andhra Pradesh', id: 'Andhra Pradesh' },
    { title: 'Arunachal Pradesh', id: 'Arunachal Pradesh' },
    { title: 'Assam', id: 'Assam' },
    { title: 'Bihar', id: 'Bihar' },
    { title: 'Chhattisgarh', id: 'Chhattisgarh' },
    { title: 'Goa', id: 'Goa' },
    { title: 'Gujarat', id: 'Gujarat' },
    { title: 'Haryana', id: 'Haryana' },
    { title: 'Himachal Pradesh', id: 'Himachal Pradesh' },
    { title: 'Jharkhand', id: 'Jharkhand' },
    { title: 'Karnataka', id: 'Karnataka' },
    { title: 'Kerala', id: 'Kerala' },
    { title: 'Madhya Pradesh', id: 'Madhya Pradesh' },
    { title: 'Maharashtra', id: 'Maharashtra' },
    { title: 'Manipur', id: 'Manipur' },
    { title: 'Meghalaya', id: 'Meghalaya' },
    { title: 'Mizoram', id: 'Mizoram' },
    { title: 'Nagaland', id: 'Nagaland' },
    { title: 'Odisha', id: 'Odisha' },
    { title: 'Punjab', id: 'Punjab' },
    { title: 'Rajasthan', id: 'Rajasthan' },
    { title: 'Sikkim', id: 'Sikkim' },
    { title: 'Tamil Nadu', id: 'Tamil Nadu' },
    { title: 'Telangana', id: 'Telangana' },
    { title: 'Tripura', id: 'Tripura' },
    { title: 'Uttar Pradesh', id: 'Uttar Pradesh' },
    { title: 'Uttarakhand', id: 'Uttarakhand' },
    { title: 'West Bengal', id: 'West Bengal' }
];