import { useState } from 'react';
import { Box, ScrollView, VStack, View,KeyboardAvoidingView} from 'native-base';
import { Alert, Platform,} from "react-native"
import UserDeatilsHeader from './UserDeatilsHeader';
import ProfileForm from './FormDeatils';
import { auth,storage, db } from '../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { setUser, setUserDetails } from '../../redux/UserSlice';
import React from 'react';
import { signOut } from 'firebase/auth/react-native';
import {ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore';

const UserDetails = () => {
    const { User, userDetails } = useSelector((state: RootState) => state.User)
    const [image, setImage] = useState<{ error: boolean, uri: null | string }>({ error: false, uri: null });
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleRightButtonPress = () => {
        signOut(auth).then(() => {
            dispatch(setUser(null))
        })
    };
    const handleSave = async (formData: any) => {
        try {
            if (image.uri && User) {
                setLoading(true)
                const response = await fetch(image.uri);
                console.log(response)
                const blob = await response.blob();
                console.log("blob",blob)
                // Use `firebase.storage()` instead of `Firebase.storage()`
                console.log("location0",`images/${new Date().getTime()}`)
                const storageref = ref(storage,`images/${new Date().getTime()}`);
                console.log("storage ref: " + storageref)

                // Use `await` instead of `.then()` to simplify the code and handle errors
                await uploadBytes(storageref,blob);
                const downloadURL = await getDownloadURL(storageref);
                // You can now save the download URL to your database or use it to display the image
                // ...
                setDoc(doc(db,"Users",User.uid),/* )
                Firebase.firestore().collection("Users").doc(User.uid).set( */{
                    ...formData,
                    photoUrl: downloadURL,
                    userId: User.uid
                }).then(() => {
                    dispatch(setUserDetails({
                        ...formData,
                        photoUrl: downloadURL,
                        userId: User.uid
                    }))
                }).catch((error) => {
                    console.log(error);

                })
            } else {
                setImage(prev => ({ ...prev, error: true }));
            }
        } catch (error) {
            console.log("this error", error);
        } finally {
            setLoading(false)
        }
    };


    return (
        <View className='flex-1'>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}  keyboardVerticalOffset={50} >
            <UserDeatilsHeader title="My Profile" onRightButtonPress={handleRightButtonPress} />
            
            <ScrollView className='bg-white h-screen'>
                        <ProfileForm onSave={handleSave} setImage={setImage} image={image} loading={loading} />
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default UserDetails;

