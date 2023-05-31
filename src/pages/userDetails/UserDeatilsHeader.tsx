import React from 'react';
import { Box, Button, HStack, Heading, Icon, IconButton, Pressable, Text } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

const UserDeatilsHeader = ({ title, onBack, onRightButtonPress }: any) => {
    return (
        <Box className='flex flex-row  items-center pt-2'>
            <Heading size="md" fontWeight={500} className='w-4/5 pl-5'>
                    {title}
                </Heading>
                <Button variant="unstyled" onPress={onRightButtonPress} py={2} px={4} borderRadius={4} colorScheme="red">
                    <Text className='text-red-600 font-semibold'>Logout</Text>
            </Button>
        </Box>
    );
};

export default UserDeatilsHeader;

