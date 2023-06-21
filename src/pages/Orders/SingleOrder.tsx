import { View, Text, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { Divider, Icon, Image } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import Lottie from 'lottie-react-native';
import { getDoc } from 'firebase/firestore';
import { Firebase } from '../../../config';
import { setGetHelpOrderId } from '../../redux/orderSlice';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ButtonCompo from '../../components/button';
import { ScrollView } from 'react-native-gesture-handler';


type RootStackParamList = {
    Product: { categoryId: string };
};

type Props = {
    route: RouteProp<RootStackParamList, 'Product'>;
}

const SingleOrder: React.FC<Props> = ({ route }) => {
    const [order, setOrder] = useState<null | any>(null)
    const { Orders } = useSelector((state: RootState) => state.Orders)
    const dispatch = useDispatch()

    useEffect(() => {
        //@ts-ignore
        const data = Orders.find(order => order.id === route.params.orderId)
        if (data) {
            setOrder(data)
            dispatch(setGetHelpOrderId(data))
        } else {
            //@ts-ignore
            Firebase.firestore().collection("Orders").doc(route.params.orderId).get().then((res) => {
                setOrder(res.data())
                dispatch(setGetHelpOrderId(res.data()))
            })
        }
    }, [Orders])

    if (!order) {
        return <Text>Loading..</Text>
    }

    return (
        <View className='min-h-screen bg-gray-50 '>
            <View className='p-5 flex-row justify-between items-center'>
                <View className='flex-row items-center gap-1'>
                    <Icon
                        as={<FontAwesome5 name="check-circle" />}
                        size={22} className='text-green-600'
                    />
                    <Text>Confirmed</Text>
                </View>
                <View className='grow px-2'>
                    <Divider />
                </View>
                <View className='flex-row items-center gap-1'>
                    {["dispatched", "completed"].includes(order.status) ? < Icon
                        as={<FontAwesome5 name="check-circle" />}
                        size={22} className='text-green-600'
                    /> : <View className='bg-gray-300 p-2 rounded-full'></View>}
                    <Text>On the way</Text>
                </View>
                <View className='grow px-2'>
                    <Divider />
                </View>
                <View className='flex-row items-center gap-1'>
                    {["completed"].includes(order.status) ? < Icon
                        as={<FontAwesome5 name="check-circle" />}
                        size={22} className='text-green-600'
                    /> : <View className='bg-gray-300 p-2 rounded-full'></View>}
                    <Text>Delivered</Text>
                </View>
            </View>
            <View className='flex-row justify-center bg-white py-5'>
                {["created", "payment completed"].includes(order.status) && <Lottie source={require('../../../assets/confirmed.json')} autoPlay loop style={{ height: 100 }} />}
                {["dispatched", "delivery partner assigned"].includes(order.status) && <Lottie source={require('../../../assets/out-for-delivery.json')} autoPlay loop style={{ height: 100 }} />}
                {["completed"].includes(order.status) && <Lottie source={require('../../../assets/delivered.json')} autoPlay loop style={{ height: 100 }} />}
            </View>
            <View className='space-y-3 p-3'>
                <Text className='font-medium text-lg text-center'>Order Details</Text>
                <ScrollView className='h-96'>
                    {order.items.map((item: any) => (
                        <View key={item.selectedVariant.id} className='bg-white rounded-lg'>
                            <View className='flex flex-row gap-3 my-1'>
                                <Image source={{ uri: item.product.image_url[0] }} alt={item.product.name} className='h-20 w-20 rounded-lg' />
                                <View className='space-y-1'>
                                    <Text className='font-bold'>{item.product.name} x {item.quantity}</Text>
                                    <Text className='font-semibold text-xs'>{item.selectedVariant.name}</Text>
                                    <Text className='text-xs'>{item.selectedVariant.weight}{item.selectedVariant.unit}</Text>
                                    <Text className='font-bold'>₹{item.selectedVariant.discountedPrice * item.quantity}</Text>
                                </View>
                            </View>
                            <View>
                                <View className='flex-row items-center'>
                                    <Text className='px-2 py1'>Rate :</Text>
                                    <RatingComponent />
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <View className='space-y-1'>
                    <ButtonCompo
                        text='Chat With Us'
                        handelClick={() => Linking.openURL(`whatsapp://send?text=Hello Vlees team,&phone=+918971892050`)}
                    />
                    <Text className='text-center'>Share your valuable feedback with us</Text>
                </View>
            </View>
        </View>
    )
}

export default SingleOrder


const RatingComponent = () => {
    const [ratings, setRatings] = useState(0)
    return (
        <AirbnbRating
            count={5}
            defaultRating={0}
            size={15}
            showRating={false}
            onFinishRating={(r) => {
                console.log(r)
            }}
        />
    )
}

export interface IRatingType {
    id: string;
    ProductId: string;
    userId: string;
    rating: number;
    comment?: string;
    date_created: string;
}