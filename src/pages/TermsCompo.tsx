import { View, Text } from 'react-native'
import React from 'react'
import { Checkbox, Divider, Icon } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const TermsCompo = () => {
    return (
        <View>
            <View className='flex-row p-3 pb-1 mb-3'>
                <View className='p-3 bg-black rounded-lg'>
                    <Icon
                        as={<MaterialIcons name="sticky-note-2" />}
                        size={22} color="white"
                    />
                </View>
                <Text className='font-semibold text-2xl ml-3'>Terms and Conditions</Text>
            </View>
            <Divider className='w-10/12 m-auto' />
            <ScrollView>
                <View className='p-3'>
                    <Text className='font-semibold'>
                        1. Introduction
                    </Text>
                    <Text>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                    </Text>
                </View>
                <View className='p-3'>
                    <Text className='font-semibold'>
                        2. Who can use this app?
                    </Text>
                    <Text>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                    </Text>
                </View>
                <View className='p-3'>
                    <Text className='font-semibold'>
                        3. Who can use this app?
                    </Text>
                    <Text>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                    </Text>
                </View>
                <View className='p-3'>
                    <Text className='font-semibold'>
                        4. Who can use this app?
                    </Text>
                    <Text>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                    </Text>
                </View>
                <View className='p-3'>
                    <Text className='font-semibold'>
                        5. Who can use this app?
                    </Text>
                    <Text>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default TermsCompo