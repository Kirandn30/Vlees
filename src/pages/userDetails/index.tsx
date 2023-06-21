import { useState } from 'react';
import { Box, ScrollView, VStack, View } from 'native-base';
import { Alert } from "react-native"
import UserDeatilsHeader from './UserDeatilsHeader';
import ProfileForm from './FormDeatils';
import { Firebase } from '../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { setUser, setUserDetails } from '../../redux/UserSlice';
import React from 'react';

const UserDetails = () => {
    const { User, userDetails } = useSelector((state: RootState) => state.User)
    const [image, setImage] = useState<{ error: boolean, uri: null | string }>({ error: false, uri: null });
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleRightButtonPress = () => {
        Firebase.auth().signOut().then(() => {
            dispatch(setUser(null))
        })
    };
    const handleSave = async (formData: any) => {
        try {
            if (image.uri && User) {
                setLoading(true)
                const response = await fetch(image.uri);
                const blob = await response.blob();
                // Use `firebase.storage()` instead of `Firebase.storage()`
                const ref = Firebase.storage().ref().child(`images/${new Date().getTime()}`);

                // Use `await` instead of `.then()` to simplify the code and handle errors
                await ref.put(blob);
                const downloadURL = await ref.getDownloadURL();
                // You can now save the download URL to your database or use it to display the image
                // ...
                Firebase.firestore().collection("Users").doc(User.uid).set({
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
            <UserDeatilsHeader title="My Profile" onRightButtonPress={handleRightButtonPress} />
            <ScrollView pagingEnabled className='bg-white pb-3 h-screen'>
                        <ProfileForm onSave={handleSave} setImage={setImage} image={image} loading={loading} />
            </ScrollView>
        </View>
    )
}

export default UserDetails;

