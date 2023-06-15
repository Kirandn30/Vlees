import { View, Text } from 'react-native'
import React from 'react'
import { Divider, Icon, TextArea } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons';
import ButtonCompo from '../components/button';


const FeedBack = () => {
    return (
        <View>
            <View className='flex-row p-3 pb-1 mb-3'>
                <View className='p-3 bg-black rounded-lg'>
                    <Icon
                        as={<MaterialIcons name="sticky-note-2" />}
                        size={22} color="white"
                    />
                </View>
                <Text className='font-semibold text-2xl ml-3'>About</Text>
            </View>
            <Divider className='w-10/12 m-auto' />
            <View className='space-y-3 p-3'>
                <Text className='text-2xl font-medium text-center'>Thank you for reaching us!</Text>
                <Text>Tell us what you love about the app, or what we could be doing better</Text>
                <View>
                    <TextArea
                        autoCompleteType={undefined}
                        placeholder='Write us here...'
                    />
                </View>
                <View className=''>
                    <ButtonCompo
                        disable={false}
                        handelClick={() => 0}
                        loading={false}
                        text='Submit'
                    />
                </View>
            </View>
        </View>
    )
}

export default FeedBack