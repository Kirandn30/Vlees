import { useEffect, useState } from 'react';
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

const UserDetails = ({log=true,img = null}) => {
    const { User, userDetails } = useSelector((state: RootState) => state.User)
    const [image, setImage] = useState<{ error: boolean, uri: null | string }>(img || userDetails?.photoUrl|| { error: false, uri: null });
    console.log("image4",img, userDetails?.photoUrl,image)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleRightButtonPress = () => {
        console.log()
        signOut(auth).then(() => {
            dispatch(setUser(null))
        })
    };

    useEffect(() => {
        //console.log("image4",log)
    }, [log])
    useEffect(() => {
        //console.log("image4",img, userDetails?.photoUrl,image)
        setImage(img || { error: false, uri: null })
    }, [img])

    const handleSave = async (formData: any) => {
        console.log(formData)
        try {
            setLoading(true)
            if (User) {
                let data = { ...formData, userId: User.uid }
                
                if (image.uri && image.uri != userDetails.photoUrl ){
                    
                const response = await fetch(image.uri);
                console.log(response)
                const blob = await response.blob();
                console.log("blob",blob)
                console.log("location0",`images/${new Date().getTime()}`)
                const storageref = ref(storage,`images/${new Date().getTime()}`);
                console.log("storage ref: " + storageref)

                await uploadBytes(storageref,blob);
                const downloadURL = await getDownloadURL(storageref);
                    data = {...data,photoUrl:downloadURL}
                    console.log("data1",{
                        ...formData,
                        photoUrl: downloadURL,
                        userId: User.uid
                    })
                    /*  */

                }
                setDoc(doc(db,"Users",User.uid),data).then(() => {
                    dispatch(setUserDetails(data))
                }).catch((error) => {
                    console.log(error);

                })
                console.log("data",data)
            } else {
                setImage(prev => ({ ...prev, error: false }));
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
            {log && <UserDeatilsHeader title="My Profile" onRightButtonPress={handleRightButtonPress} />}
            
            <ScrollView className={`bg-white ${log? "h-screen":"h-[25%]"}`}>
                        <ProfileForm onSave={handleSave} setImage={setImage} image={image} loading={loading} />
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default UserDetails;

