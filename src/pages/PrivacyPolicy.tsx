import { View, Text } from 'react-native'
import React from 'react'
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import { AntDesign } from '@expo/vector-icons';
import { Divider, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPolicy = () => {
    return (
        <View>
            <View className='flex-row p-3 pb-1 mb-3'>
                <View className='p-3 bg-black rounded-lg'>
                    <Icon
                        as={<AntDesign name="lock" />}
                        size={22} color="white"
                    />
                </View>
                <Text className='font-semibold text-2xl ml-3'>Terms and Condition</Text>
            </View>
            <Divider className='w-10/12 m-auto' />
            <View className='p-3'>
                <Text>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
                </Text>
            </View>
            <View className='p-3 space-y-3'>
                <Collapse>
                    <CollapseHeader>
                        <View className='p-3 flex-row items-center gap-1 border-solid border-gray-300 rounded-lg border-[1px]'>
                            <Icon
                                as={<Ionicons name="information-circle-outline" />}
                                size={22} color="black"
                            />
                            <Text className='font-semibold'>Type of information</Text>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <Text>Type of information</Text>
                    </CollapseBody>
                </Collapse>
                <Collapse>
                    <CollapseHeader>
                        <View className='p-3 flex-row items-center gap-1 border-solid border-gray-300 rounded-lg border-[1px]'>
                            <Icon
                                as={<Ionicons name="information-circle-outline" />}
                                size={22} color="black"
                            />
                            <Text className='font-semibold'>How Information is used?</Text>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <Text>Type of information</Text>
                    </CollapseBody>
                </Collapse>
                <Collapse>
                    <CollapseHeader>
                        <View className='p-3 flex-row items-center gap-1 border-solid border-gray-300 rounded-lg border-[1px]'>
                            <Icon
                                as={<Ionicons name="information-circle-outline" />}
                                size={22} color="black"
                            />
                            <Text className='font-semibold'>Contact information</Text>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <Text>Type of information</Text>
                    </CollapseBody>
                </Collapse>
                <Collapse>
                    <CollapseHeader>
                        <View className='p-3 flex-row items-center gap-1 border-solid border-gray-300 rounded-lg border-[1px]'>
                            <Icon
                                as={<Ionicons name="information-circle-outline" />}
                                size={22} color="black"
                            />
                            <Text className='font-semibold'>Use of Cookies, Log Files</Text>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <Text>Type of information</Text>
                    </CollapseBody>
                </Collapse>
                <Collapse>
                    <CollapseHeader>
                        <View className='p-3 flex-row items-center gap-1 border-solid border-gray-300 rounded-lg border-[1px]'>
                            <Icon
                                as={<Ionicons name="information-circle-outline" />}
                                size={22} color="black"
                            />
                            <Text className='font-semibold'>Opt-Out Policay Clause</Text>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <Text>Type of information</Text>
                    </CollapseBody>
                </Collapse>
            </View>
        </View>
    )
}

export default PrivacyPolicy