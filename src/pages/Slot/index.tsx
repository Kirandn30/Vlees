import { View, Text, Pressable } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Timestamp, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Divider, Drawer, Icon, IconButton } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import ButtonCompo from '../../components/button';
import uuid from 'react-native-uuid';
import { db } from '../../../config';
import { useNavigation, StackActions } from '@react-navigation/native';
import { clearCart } from '../../redux/CartSlice';
import RNDateTimePicker,{DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { buildInvoice } from '../../services/buildInvoice';
import { Feather } from '@expo/vector-icons';

const SlotBook = () => {
    
    const [isTimeGreaterTan3PM, setIsTimeGreaterTan3PM] = useState<boolean | "NA">(false)
    const { total_price, items, total_items } = useSelector((state: RootState) => state.Cart)
    const { addresses, location, placeName } = useSelector((state: RootState) => state.Location)
    const { userDetails, User } = useSelector((state: RootState) => state.User)
    const navigate = useNavigation()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [show, setShow] = useState(false);
    const [minDate, setMinDate] = useState<Date|null>(null)
    const [date, setDate] = useState<Date|null>(null)
    const [type,setType] = useState<"time"|"date">("date")
    useEffect(() => {
        (async () => {
            try {
                // Get the server's timestamp
                setIsTimeGreaterTan3PM("NA")
                const serverTimeSnapshot = Timestamp;
                const serverTime = serverTimeSnapshot.now().toDate();
                console.log("x",serverTime)
                if(serverTime.getHours() < 15){
                    serverTime.setDate(serverTime.getDate()+1)
                }
                else{
                    serverTime.setDate(serverTime.getDate()+2)
                }
                serverTime.setHours(0, 0, 0, 0)
                console.log("x",serverTime.toLocaleTimeString())
                setMinDate(serverTime)
                setDate(serverTime)
                setIsTimeGreaterTan3PM(serverTime.getHours() >= 15)
                // Set the time to 3 PM
            } catch (error) {
                console.error("Error checking time:", error);
            }
        })()
      
        setSelectedAddress(addresses.find(item => item.addressName === placeName))
    }, [])

    useEffect(()=>{
        console.log("show",show)
    },[show])

    useEffect(()=>{
        setShow(false)
    },[date])


    



    if ((typeof isTimeGreaterTan3PM) === "string") {
        return <Text>Loading...</Text>
    }

    return (
        <View className='min-h-screen bg-white'>
            <Text className='text-center text-lg font-medium my-3'>When do you want us to deliver your order.</Text>
            <View className='border-dotted border-gray-300 border-[2px] mx-5 p-3 space-y-3 rounded-xl'>
                <Text className='font-semibold text-lg text-center'>Shipping Details</Text>
                <View className='space-y-3 mx-5'>
                    <View className='flex-row  space-x-4'>
                        <Text className='font-medium'>Selected Address</Text>
                        <View>
                            <Text>{selectedAddress?.houseFlatNo}, {selectedAddress?.buildingName}</Text>
                            <Text className='flex grow w-[130px]'>{selectedAddress?.placeName}</Text>
                        </View>
                    </View>
                    <View className='flex-row justify-between'>
                        <Text className='font-medium'>Delivery Date</Text>
                        <View className='flex flex-row items-center'>
                            <Text>{date?date.toDateString():"Not selected"} </Text>
                            <IconButton padding={0} icon={<Icon as={Feather} size={4} name='edit' />} onPress={()=> {
                            setType("date")
                            
                            DateTimePickerAndroid.open({
                                mode: "date",
                                value:date?date:new Date(),
                                minimumDate:minDate?minDate:new Date(),
                                onChange(event, date) {
                                    if(event.type === "set" && date){
                                        date.setMinutes(0)
                                        setDate(date)
                                    
                                }
                                },
                            })
                            
                        }}/></View>
                    </View>
                    <View className='flex-row justify-between'>
                        <Text className='font-medium'>Delivery Slot</Text>
                        <View className='flex flex-row items-center'>
                            <Text>{date && date.toLocaleTimeString()} </Text>
                            <IconButton padding={0} icon={<Icon as={Feather} size={4} name='edit' />} onPress={()=> {
                             DateTimePickerAndroid.open({
                                mode: "time",
                                display:"spinner",
                                minuteInterval:30,
                                is24Hour:false,
                                value:date?date:new Date(),
                                minimumDate:minDate?minDate:new Date(),
                                onChange(event, date) {
                                    if(event.type === "set" && date){
                                        date.setMinutes(0)
                                        setDate(date)
                                    
                                }
                                },
                            })
                            
                        }}/>
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
                <View className='mb-20 px-5 pt-3'>
                    <View className='self-stretch'>
                        <Button
                            className='bg-black w-full'
                            onPress={async () => {
                                
                                if (!User) return
                                
                                if (items.length === 0) return
                                setLoading(true)
                                if (!selectedAddress) return
                                const OrderId = uuid.v4()
                                console.log("a")
                                const Order = {
                                    id: OrderId,
                                    items: items,
                                    total_items: total_items,
                                    total_price: total_price,
                                    payment_details: {},
                                    payment_method: 'online',
                                    shipping_details: {
                                        delivery_slot: Timestamp.fromDate(date?date:new Date()),
                                        name: userDetails.name,
                                        email: userDetails.email,
                                        address: selectedAddress
                                        
                                    },
                                    status: "payment completed",
                                    date_created: Timestamp.now(),
                                    UserId: User.uid
                                }
                                console.log(Order)
                                const invoice = await buildInvoice(Order)
                                console.log(invoice)
                                
                                setDoc(doc(db, "Orders", OrderId), {...Order,invoice})
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