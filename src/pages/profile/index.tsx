import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RoundImageButton from '../userDetails/AvatarCompo'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { Button, HStack, ScrollView } from 'native-base'
import ProfileForm from '../userDetails/FormDeatils'
import UserDetails from '../userDetails'
import MoreDetails from './MoreDetails'

const Profile = () => {
    const [seleted, setSeleted] = useState<"details" | "more">("details")
    const { userDetails } = useSelector((state: RootState) => state.User)
    const [image, setImage] = useState<{ error: boolean, uri: null | string }>({ error: false, uri: null });
    const [uploaded, setUploaded] = useState(false)

    const handleImage = (x:{ error: boolean, uri: null | string }) => {
        setUploaded(true)
        setImage(x)

    }

    return (
        <View className='flex-1'>
            <View className='mt-16'></View>
            {!userDetails.photoUrl||!image.uri?<HStack h="1" className='flex justify-center items-center'>
                                    <View>
                                        <RoundImageButton image={{ uri: uploaded?image.uri:userDetails.photoUrl }} setImage={handleImage}  />
                                    </View>
                                </HStack>:
            <RoundImageButton image={{ uri: uploaded?image.uri:userDetails.photoUrl }} setImage={handleImage} />}
            <View className='mb-16'></View>
            <View className='flex-row justify-center gap-5'>
                <View className={seleted === "details" ? 'border-solid border-black border-b-[3px]' : ""}>
                    <Button variant="unstyled" onPress={() => setSeleted("details")}>
                        <Text className='font-semibold text-lg'>Details</Text>
                    </Button>
                </View>
                <View className={seleted === "more" ? 'border-solid border-black border-b-[3px]' : ""}>
                    <Button variant="unstyled" onPress={() => setSeleted("more")}>
                        <Text className='font-semibold text-lg'>More</Text>
                    </Button>
                </View>
            </View>
            <ScrollView pagingEnabled className='bg-white pb-3 h-screen'>
                {seleted === "details" ? <UserDetails log={false} img={image} /> : <MoreDetails />}
            </ScrollView>
        </View>
    )
}

export default Profile