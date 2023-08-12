import { View, Text } from 'react-native'
import React from 'react'
import { Alert, CloseIcon, Divider, HStack, Icon, IconButton, TextArea, VStack } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons';
import ButtonCompo from '../components/button';
import { Review, addReview } from '../services/reviewService';
import uuid from 'react-native-uuid';
import { auth } from '../../config';
import { useToast } from 'native-base';


const FeedBack = () => {
    const toast = useToast()
    const [review, setReview] = React.useState<string>('')
    const handleSubmit = async () => {
        if (!review){
            toast.show({
                title: "Feedback submitted successfully",
                placement: 'bottom',
                duration: 3000,
                render: () => {
                    return <Alert w="100%" status={"warning"}>
                    <VStack space={2} flexShrink={1} alignItems={"center"} justifyContent={"center"} w="100%">
                      <HStack flexShrink={1} space={2} justifyContent="space-between">
                        <HStack space={2} flexShrink={1}>
                          <Alert.Icon mt="1" />
                          <Text className='text-base' color="coolGray.800">
                            Feedback cannot be empty
                          </Text>
                        </HStack>
                        <IconButton onPress={()=>toast.closeAll()} variant="unstyled" _focus={{
                      borderWidth: 0
                    }} icon={<CloseIcon size="3" />} _icon={{
                      color: "coolGray.600"
                    }} />
                      </HStack>
                    </VStack>
                  </Alert>;
                }
            })
             return}
        const id = uuid.v4()
        const uid = auth.currentUser?.uid
        const data = {
            id,
            feedback:review,
            userId:uid
        } as Review
        const res = await addReview(data)
        console.log(res)
        if(res) setReview('')
        toast.show({
            title: "Feedback submitted successfully",
            placement: 'bottom',
            duration: 3000,
            render: () => {
                return <Alert w="100%" status={res}>
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack flexShrink={1} space={2} justifyContent="space-between">
                    <HStack space={2} flexShrink={1}>
                      <Alert.Icon mt="1" />
                      <Text className='text-base' color="coolGray.800">
                        {res == "success" ? "Feedback submitted successfully" : "Something went wrong"}
                      </Text>
                    </HStack>
                    <IconButton onPress={()=>toast.closeAll()} variant="unstyled" _focus={{
                  borderWidth: 0
                }} icon={<CloseIcon size="3" />} _icon={{
                  color: "coolGray.600"
                }} />
                  </HStack>
                </VStack>
              </Alert>;
            }
        })
    }
    return (
        <View>
            <View className='flex-row p-3 pb-1 mb-3'>
                <View className='p-3 bg-black rounded-lg'>
                    <Icon
                        as={<MaterialIcons name="sticky-note-2" />}
                        size={22} color="white"
                    />
                </View>
                <Text className='font-semibold text-2xl ml-3'>Feedback</Text>
            </View>
            <Divider className='w-10/12 m-auto' />
            <View className='space-y-3 p-3'>
                <Text className='text-2xl font-medium text-center'>Thank you for reaching us!</Text>
                <Text>Tell us what you love about the app, or what we could be doing better</Text>
                <View>
                    <TextArea
                        autoCompleteType={undefined}
                        placeholder='Write us here...'
                        onChangeText={(e) => setReview(e)}
                        value={review}
                    />
                </View>
                <View className=''>
                    <ButtonCompo
                        disable={false}
                        handelClick={() => handleSubmit()}
                        loading={false}
                        
                        text='Submit'
                    />
                </View>
            </View>
        </View>
    )
}

export default FeedBack