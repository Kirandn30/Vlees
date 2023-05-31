import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Button, Card, Drawer, Image } from 'native-base'
import Carousel from 'react-native-snap-carousel';
import { TouchableOpacity } from 'react-native-gesture-handler';
import VarientsCard from './VarientsCard';

const ProductCard = ({ product }: {
    product: IProductType
}) => {

    const deviceWidth = Dimensions.get("window").width;
    const [drawer, setDrawer] = useState(false)

    const renderItem = ({ item }: { item: string }) => {
        return (
            <View >
                <Image source={{ uri: item }} alt='' className='h-48' />
            </View>
        );
    };

    return (
        <View className='mb-3 mx-5 shadow-2xl bg-white overflow-hidden rounded-xl'>
            <Carousel
                data={product.image_url}
                renderItem={renderItem}
                sliderWidth={deviceWidth - 40}
                itemWidth={deviceWidth - 40}
                layout='default'
                showsHorizontalScrollIndicator
                indicatorStyle="default"
                loop
            />
            <View className='flex justify-between p-3 space-y-3'>
                <View>
                    <Text className='font-bold text-lg'>{product.name}</Text>
                    <Text className='text-xs text-gray-500'>{product.caption}</Text>
                </View>
                <View className='flex flex-row justify-end'>
                    <TouchableOpacity
                        className='border-solid border-gray-400 border-[1px] rounded-lg px-2 py-1'
                        onPress={() => setDrawer(true)}
                    >
                        <Text className='text-red-700'>{product.variantes.length} Options</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Drawer
                isOpen={drawer}
                children={<VarientsCard variantes={product.variantes} setDrawer={setDrawer} />}
                onClose={() => setDrawer(false)}
                key={product.id}
                placement='bottom'
            />
        </View>
    )
}

export default ProductCard