import { View, Text, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Divider } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import ButtonCompo from '../../components/button';
import uuid from 'react-native-uuid';
import { Firebase } from '../../../config';
import { useNavigation, StackActions } from '@react-navigation/native';
import { clearCart } from '../../redux/CartSlice';
import { SelectedAddress } from '../Cart';


const SlotBook = () => {
    const [date, setDate] = useState<string[]>(["9 AM", "12 PM", "3 PM"]);
    const [isTimeGreaterTan3PM, setIsTimeGreaterTan3PM] = useState<boolean | "NA">(false)
    const [day, setDay] = useState({ tommorow: { day: "", date: 0 }, dayAfterTommorow: { day: "", date: 0 }, seletedDay: '' })
    const [selectTime, setSelectTime] = useState("9 AM")
    const { total_price, items, total_items } = useSelector((state: RootState) => state.Cart)
    const { addresses, location, placeName } = useSelector((state: RootState) => state.Location)
    const { userDetails, User } = useSelector((state: RootState) => state.User)
    const navigate = useNavigation()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)


    useEffect(() => {
        (async () => {
            try {
                // Get the server's timestamp
                const serverTimeSnapshot = Timestamp;
                const serverTime = serverTimeSnapshot.now().toDate();
                // Set the time to 3 PM
                const targetTime = new Date();
                targetTime.setHours(15, 0, 0); // Set to 3 PM
                // Compare the server's timestamp to the target time
                const isGreater = serverTime > targetTime;
                setIsTimeGreaterTan3PM(isGreater);
                const tomorrow = new Date(serverTime);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowDate = tomorrow.getDate();
                const tomorrowDayName = getDayName(tomorrow.getDay());

                // Get the day after tomorrow's date
                const dayAfterTomorrow = new Date(serverTime);
                dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
                const dayAfterTomorrowDate = dayAfterTomorrow.getDate();
                const dayAfterTomorrowDayName = getDayName(dayAfterTomorrow.getDay());
                function getDayName(day: number) {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return days[day];
                }
                setDay({ tommorow: { date: tomorrowDate, day: tomorrowDayName }, dayAfterTommorow: { date: dayAfterTomorrowDate, day: dayAfterTomorrowDayName }, seletedDay: isGreater ? 'dayaftertommorow' : 'tommorow' })
            } catch (error) {
                console.error("Error checking time:", error);
            }
        })()
      
        setSelectedAddress(addresses.find(item => item.addressName === placeName))
    }, [])

    useEffect(() => {
        console.log("add")
        console.log("selectedAddress", selectedAddress);
    }, [selectedAddress])


    if ((typeof isTimeGreaterTan3PM) === "string") {
        return <Text>Loading...</Text>
    }

    return (
        <View className='min-h-screen bg-white'>
            <Text className='text-center text-lg font-medium my-3'>When do you want us to deliver your order.</Text>
            <View className='flex-row'>
                <View className='grow'>
                    <View className='flex-row justify-center gap-5'>
                        {!isTimeGreaterTan3PM && <Button variant="outline"
                            onPress={() => setDay(prev => ({ ...prev, seletedDay: "tommorow" }))}
                            className={day.seletedDay === "tommorow" ? 'bg-black' : ""}
                        >
                            <Text className={day.seletedDay === "tommorow" ? 'font-medium text-center px-5 text-white' : 'font-medium text-center px-5 text-black'}>{`${day.tommorow.date} - ${day.tommorow.day}`}</Text>
                        </Button>}
                        <Button variant="outline"
                            onPress={() => setDay(prev => ({ ...prev, seletedDay: "dayaftertommorow" }))}
                            className={day.seletedDay === "dayaftertommorow" ? 'bg-black' : ""}
                        >
                            <Text className={day.seletedDay === "dayaftertommorow" ? 'font-medium text-center text-white' : 'font-medium text-center text-black'}>{`${day.dayAfterTommorow.date} - ${day.dayAfterTommorow.day}`}</Text>
                        </Button>
                    </View>
                    <View className='h-40 w-1/2 m-auto my-5'>
                        <View>
                            <ScrollView>
                                {date.map(time => (
                                    <Pressable onPress={() => setSelectTime(time)}>
                                        <View className={selectTime === time ? 'my-1 bg-slate-300 p-3 rounded-lg border-solid border-[2px] border-black' : 'my-1 bg-slate-300 p-3 rounded-lg'}>
                                            <Text className='text-center font-semibold'>{time}</Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
            <View className='border-dotted border-gray-300 border-[2px] m-5 p-3 space-y-3 rounded-xl'>
                <Text className='font-semibold text-lg text-center'>Bill Details</Text>
                <View className='space-y-3 mx-5'>
                    <View className='flex-row justify-between'>
                        <Text className='font-medium'>Subtotal</Text>
                        <Text>₹{total_price}</Text>
                    </View>
                    <View className='flex-row justify-between'>
                        <Text className='font-medium'>GST 5%</Text>
                        <Text>₹{total_price * 0.05}</Text>
                    </View>
                    <View className='flex-row justify-between'>
                        <Text className='font-medium'>Delivery Charges</Text>
                        <Text>₹0.00</Text>
                    </View>
                </View>
                <Divider />
                <View className='flex-row justify-between mx-5'>
                    <Text className='text-xl font-bold'>Total</Text>
                    <Text className='text-xl font-bold'>₹ {total_price + total_price * 0.05}</Text>
                </View>
            </View>
            <View className='flex-1 justify-between'>
                <View className='grow'>
                </View>
                <Divider />
                <View className='mb-20 flex-row justify-between px-5 items-center pt-3'>
                    <Text className='text-lg font-bold'>Total : ₹ {total_price + total_price * 0.05}</Text>
                    <View className='self-stretch'>
                        <Button
                            className='bg-black w-24'
                            onPress={async () => {
                                if (!User) return
                                if (items.length === 0) return
                                setLoading(true)
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
                                        address_id: selectedAddress.id,
                                        address_line_1: selectedAddress.houseFlatNo,
                                        address_line_2: selectedAddress.buildingName,
                                        lat: location?.latitude,
                                        log: location?.latitude,
                                        formatted_address: placeName
                                    },
                                    status: "created",
                                    date_created: serverTimestamp(),
                                    UserId: User.uid
                                }
                                // @ts-ignore
                                Firebase.firestore().collection("Orders").doc(OrderId).set(Order)
                                    .then(() => {
                                        setTimeout(() => {
                                            //@ts-ignore
                                            navigate.navigate('OrderId', { orderId: OrderId })
                                            dispatch(clearCart())
                                            setLoading(false)
                                        }, 2000)
                                    })
                                    .catch((error) => console.log(error))
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
                            isLoading={loading}
                        >Place Order</Button>
                    </View>
                </View>
            </View>
        </View >
    )
}

export default SlotBook


const removePreviousTwoScreens = () => {

};