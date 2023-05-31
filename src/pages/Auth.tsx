import { Text, View, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useRef } from 'react'
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha"
import { Firebase, firebaseConfig } from '../../config'
import { Input, Image, Icon, Checkbox, FormControl } from "native-base";
import { Feather, EvilIcons, AntDesign } from "@expo/vector-icons";
import ButtonCompo from '../components/button';
import CustomKeyboardAvoidingView from '../components/keyboardAvoid';

const PhoneAuth = () => {
    const [phoneNumber, setPhoneNumber] = useState<null | string>(null)
    const [code, setCode] = useState<null | string>(null)
    const recaptchaVerifier = useRef<undefined | any>(undefined)
    const [verificationId, setVerificationId] = useState<any>(null)
    const [termsAndCond, setTermsAndCond] = useState(false)
    const [notValid, setNotValid] = useState(false)
    const [loading, setLoading] = useState(false)
    const [validOTP, setValidOTP] = useState(false)

    const sendVerificationCode = async () => {
        try {
            if (!phoneNumber || !recaptchaVerifier.current) return
            if (isValidIndianPhoneNumber(phoneNumber)) {
                setLoading(true)
                const phoneProvider = new Firebase.auth.PhoneAuthProvider()
                const id = await phoneProvider.verifyPhoneNumber(`+91${phoneNumber}`, recaptchaVerifier.current)
                setVerificationId(id)
                setPhoneNumber(null)
                setNotValid(false)
                setLoading(false)
            } else {
                setNotValid(true)
            }
        } catch (error: any) {
            setLoading(false)
            console.log(error.message);

        }
    }

    const confirmVerificationCode = async () => {
        try {
            if (!verificationId || !code) return
            if (code.length === 6) {
                setLoading(true)
                const credential = Firebase.auth.PhoneAuthProvider.credential(verificationId, code)
                await Firebase.auth().signInWithCredential(credential)
                setCode(null)
                setLoading(false)
            } else {
                setValidOTP(true)
            }
        } catch (error: any) {
            setLoading(false)
            setValidOTP(true)
        }
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='mb-10'>
                    <View className='h-screen' >
                        <View>
                            <View className='relative'>
                                <Image
                                    className='h-48'
                                    source={require('../../assets/loginMain.png')}
                                    alt='hero'
                                />
                                <View className='relative h-20'>
                                    <View className='h-20 absolute -top-1/4 m-auto w-full'>
                                        {/* <Image
                                            className='w-3/4 h-20 m-auto rounded-lg'
                                            source={require('../../assets/meatfouru.png')}
                                            alt='meat4u'
                                        /> */}
                                    </View>
                                </View>
                                <View className='space-y-3 mt-10'>
                                    <Text className='text-center text-4xl font-semibold'>Welcome!</Text>
                                    <Text className='text-center text-2xl font-normal text-gray-400'>Sign-in with Phone number</Text>
                                </View>
                            </View>
                            <CustomKeyboardAvoidingView>
                                <View className='w-4/5 m-auto mt-10 space-y-3 h-48'>
                                    <View>
                                        <FormControl isInvalid={notValid} >
                                            <FormControl.Label>Phone Number</FormControl.Label>
                                            <Input
                                                isReadOnly={Boolean(verificationId) || loading}
                                                className='placeholder:text-lg font-bold'
                                                InputLeftElement={<Icon as={<Feather name="phone" />} ml="2" />}
                                                InputRightElement={verificationId ? <Icon
                                                    onPress={() => {
                                                        setVerificationId(null)
                                                        setNotValid(false)
                                                        setValidOTP(false)
                                                    }}
                                                    as={<AntDesign name="edit" />} mr="5" /> : <View />}
                                                variant="filled"
                                                placeholder='Enter Phone Number'
                                                onChangeText={setPhoneNumber}
                                                keyboardType='phone-pad'
                                                autoComplete='tel'
                                                bg="amber.400"
                                                size="xs"

                                            />
                                            <FormControl.ErrorMessage>
                                                Enter a valid phone number.
                                            </FormControl.ErrorMessage>
                                        </FormControl>
                                    </View>
                                    {verificationId && <View>
                                        <FormControl isInvalid={validOTP} >
                                            <FormControl.Label>OTP</FormControl.Label>
                                            <Input
                                                isDisabled={!Boolean(verificationId)}
                                                className='placeholder:text-lg font-bold'
                                                InputLeftElement={<Icon as={<EvilIcons name="unlock" />} ml="2" size="xl" />}
                                                variant="filled"
                                                placeholder='Enter OTP'
                                                onChangeText={setCode}
                                                keyboardType='phone-pad'
                                                autoComplete='tel'
                                                bg="amber.400"
                                                size="xs"
                                                autoFocus
                                                maxLength={6}
                                            />
                                            <FormControl.ErrorMessage>
                                                Enter a correct OTP.
                                            </FormControl.ErrorMessage>
                                        </FormControl>
                                        <Checkbox
                                            value='test'
                                            size="sm"
                                            my={2}
                                            onChange={(e) => setTermsAndCond(e)}
                                        >
                                            I agree with terms & conditions
                                        </Checkbox>
                                    </View>}
                                    <View>
                                        <ButtonCompo
                                            disable={verificationId ? !termsAndCond : false}
                                            handelClick={!verificationId ? sendVerificationCode : confirmVerificationCode}
                                            text={!verificationId ? "Get OTP" : "Enter"}
                                            loading={loading}
                                        />
                                    </View>
                                </View>
                            </CustomKeyboardAvoidingView>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                attemptInvisibleVerification={true}
                title='Prove you are human!'
                cancelLabel='Close'
            />
        </View>
    )
}

export default PhoneAuth

function isValidIndianPhoneNumber(phoneNumber: string) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
}
