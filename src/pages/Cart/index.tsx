import { View, Text, Dimensions, Pressable, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { MaterialIcons } from '@expo/vector-icons';
import { Divider, Icon, Image } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Entypo } from '@expo/vector-icons';
import { addItems, removeItems } from '../../redux/CartSlice';
import { Ionicons } from '@expo/vector-icons';
import ButtonCompo from '../../components/button';
import { serverTimestamp } from "firebase/firestore";
import { Firebase } from '../../../config';
import uuid from 'react-native-uuid';

const Cart = () => {
    const { items, total_items, total_price } = useSelector((state: RootState) => state.Cart)
    const { location, placeName, addresses } = useSelector((state: RootState) => state.Location)
    const { User, userDetails } = useSelector((state: RootState) => state.User)

    const [savings, setSavings] = useState(0)
    const deviceHeight = Dimensions.get("window").height;
    const dispatch = useDispatch()
    const getOrderId = Firebase.functions().httpsCallable('getOrderId');

    useEffect(() => {
        const totalPrice = items.reduce((accumulator, currentItem) => {
            const { quantity, selectedVariant } = currentItem;
            const itemPrice = quantity * selectedVariant.originalPrice - selectedVariant.discountedPrice;
            return accumulator + itemPrice;
        }, 0);
        setSavings(totalPrice)
    }, [items])

    const renderItem = ({ item }: {
        item: {
            product: IProductBase;
            quantity: number;
            selectedVariant: IVariantType,
        }
    }) => {
        return (
            <View key={item.selectedVariant.id} className='flex flex-row justify-between'>
                <View className='flex flex-row gap-3 my-1'>
                    <Image source={{ uri: item.product.image_url[0] }} alt={item.product.name} className='h-20 w-20 rounded-lg' />
                    <View className='space-y-1'>
                        <Text className='font-bold'>{item.product.name}</Text>
                        <Text className='font-semibold text-xs'>{item.selectedVariant.name}</Text>
                        <Text className='text-xs'>{item.selectedVariant.weight}{item.selectedVariant.unit}</Text>
                        <Text className='font-bold'>₹{item.selectedVariant.discountedPrice * item.quantity}</Text>
                    </View>
                </View>
                <View className='self-center'>
                    <View className='flex-row border-solid border-gray-300 rounded-md p-1 border-[1px] justify-around space-x-2'>
                        <Pressable
                            onPress={() => {
                                dispatch(removeItems({
                                    product: item.product,
                                    quantity: 1,
                                    selectedVariant: item.selectedVariant
                                }))
                            }}
                        >
                            <Icon
                                as={<Entypo name="minus" />}
                                size={18} color="black"
                            />
                        </Pressable>
                        <Text className='font-bold'>{item.quantity}</Text>
                        <Pressable
                            onPress={() => {
                                dispatch(addItems({
                                    product: item.product,
                                    quantity: 1,
                                    selectedVariant: item.selectedVariant
                                }))
                            }}
                        >
                            <Icon
                                as={<Entypo name="plus" />}
                                size={18} color="black"
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    };


    return (
        <View className='bg-red-50 relative flex-1 justify-between'>
            {/* <ScrollView> */}
            <View className='space-y-5'>
                <View className='bg-[#d8f3dc] p-4'>
                    <Text className='text-2xl font-bold text-green-800'>₹{savings} Savings</Text>
                    <Text className='text-green-800'>Save more on every order</Text>
                </View>
                <View className='p-4 bg-white flex flex-row'>
                    <Icon
                        as={<MaterialIcons name="local-offer" />}
                        size={25}
                        color="black"
                    />
                    <View className='grow pl-5'>
                        <Text className='text-xl font-semibold'>
                            Apply Coupon
                        </Text>
                        <Text className='text-orange-500'>
                            Save more with coupons available for you
                        </Text>
                    </View>
                    <Icon
                        as={<AntDesign name="right" />}
                        size={18}
                        color="black"
                    />
                </View>
                <View className='p-4 bg-white'>
                    <View className='flex flex-row gap-3'>
                        <Icon
                            as={<FontAwesome name="shopping-cart" />}
                            size={18}
                            color="black"
                        />
                        <Text className='text-lg font-semibold'>
                            Review Items
                        </Text>
                    </View>
                    <FlatList
                        className='min-h-fit max-h-96'
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.selectedVariant.id}
                    />
                </View>
            </View>
            {/* </ScrollView> */}
            <View className='bg-white'>
                <View className='flex-row justify-between pr-5'>
                    <View className=' p-3 flex-row'>
                        <View>
                            <Icon
                                as={<Ionicons name="location-outline" />}
                                size={18} color="black"
                            />
                        </View>
                        <View>
                            <Text numberOfLines={1} className='w-40'>Deliver to {placeName}</Text>
                        </View>
                    </View>
                    <Pressable className='self-center'>
                        <Text className='font-bold text-md'>Change</Text>
                    </Pressable>
                </View>
                <Divider className='w-11/12 m-auto' />
                <View className='p-3 flex-row justify-between bg-white pl-6'>
                    <View className='self-center'>
                        <Text className='font-bold text-lg'>₹{total_price}</Text>
                    </View>
                    <View>
                        <ButtonCompo
                            disable={false}
                            handelClick={async () => {
                                console.log("start");
                                const selectedAddress = addresses.find(item => item.addressName === placeName)
                                if (!selectedAddress) return
                                const OrderId = uuid.v4()
                                const Order = {
                                    id: OrderId,
                                    invoice: {},
                                    items: items,
                                    total_items: total_items,
                                    total_price: total_price,
                                    payment_details: {},
                                    payment_method: 'online',
                                    shipping_address: {
                                        name: userDetails.name,
                                        phone: userDetails.phoneNumber,
                                        email: userDetails.email,
                                        address_line_1: selectedAddress.houseFlatNo,
                                        address_line_2: selectedAddress.buildingName,
                                        lat: location?.latitude,
                                        log: location?.latitude,
                                        formatted_address: placeName
                                    },
                                    status: "created",
                                    date_created: serverTimestamp()
                                }
                                // @ts-ignore
                                Firebase.firestore().collection("Orders").doc(OrderId).set(Order)
                                console.log("done");

                                //     .then(() => {
                                //         getOrderId(OrderId).then((res => {
                                //             var options = {
                                //                 currency: "INR",
                                //                 description: 'Credits towards consultation',
                                //                 image: 'https://i.imgur.com/3g7nmJC.png',
                                //                 key: 'rzp_test_0IQb4FosmbMcvb', // Your api key
                                //                 name: 'foo',
                                //                 prefill: {
                                //                     email: 'void@razorpay.com',
                                //                     contact: '9191919191',
                                //                     name: 'Razorpay Software'
                                //                 },
                                //                 theme: { color: '#F37254' },
                                //                 order_id: res.data.id,
                                //                 amount: Order.total_price
                                //             }
                                //             RazorpayCheckout.open(options).then(data => {
                                //                 console.log(data);

                                //             })

                                //             RazorpayCheckout.open(options).then((data) => {
                                //                 // handle success
                                //                 alert(`Success: ${data.razorpay_payment_id}`);
                                //             }).catch((error) => {
                                //                 // handle failure
                                //                 // alert(`Error: ${error.code} | ${error.description}`);
                                //                 console.log(error);

                                //             });
                                //         }))
                                // })
                            }}
                            loading={false}
                            text='MAKE PAYMENT'
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Cart


interface IOrderType {
    id: string;
    items: {
        product: IProductBase;
        quantity: number;
        selectedVariant: IVariantType
    }[];
    total_items: number;
    total_price: number;
    invoice: {},
    payment_details: {},
    shipping_address: {
        name: string;
        phone: string;
        email: string;
        address_line_1: string;
        address_line_2?: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
        placeId: string;
        lat: number;
        log: number;
        formatted_address: string
    };
    payment_method: string;
    status: string;
    date_created: any;
}
