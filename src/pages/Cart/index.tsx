import { View, Text, Dimensions, Pressable, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Divider, Drawer, Icon, Image } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Entypo } from '@expo/vector-icons';
import { addItems, removeItems } from '../../redux/CartSlice';
import { Ionicons } from '@expo/vector-icons';
import ButtonCompo from '../../components/button';
import { collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { Firebase } from '../../../config';
import { setAddresses, setLocation, setPlaceName } from '../../redux/Mapslice';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const Cart = () => {
    const { items, total_items, total_price } = useSelector((state: RootState) => state.Cart)
    const { location, placeName, addresses } = useSelector((state: RootState) => state.Location)
    const { User, userDetails } = useSelector((state: RootState) => state.User)
    const [isOpen, setIsOpen] = useState(false)

    const [savings, setSavings] = useState(0)
    const deviceHeight = Dimensions.get("window").height;
    const dispatch = useDispatch()
    const getOrderId = Firebase.functions().httpsCallable('getOrderId');
    const navigate = useNavigation()


    useEffect(() => {
        const totalPrice = items.reduce((accumulator, currentItem) => {
            const { quantity, selectedVariant } = currentItem;
            const itemPrice = quantity * selectedVariant.originalPrice - selectedVariant.discountedPrice;
            return accumulator + itemPrice;
        }, 0);
        setSavings(totalPrice)
    }, [items])

    useEffect(() => {
        if (!User) return
        const unsub = onSnapshot(query(collection(Firebase.firestore(), "Address"), where("userId", "==", User.uid)), (snap) => {
            dispatch(setAddresses(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
        })
        return () => unsub()
    }, [])


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
                        <View className='flex-row gap-x-1'>
                            <Text className='font-bold'>₹{item.selectedVariant.discountedPrice * item.quantity}</Text>
                            <Text className='text-gray-500 text-xs line-through'>₹{item.selectedVariant.originalPrice * item.quantity}</Text>
                        </View>
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
        <View className='bg-gray-50 relative flex-1 justify-between'>
            <View className='space-y-5'>
                <View className='bg-[#d8f3dc] p-4'>
                    <Text className='text-2xl font-bold text-green-800'>₹{savings} Savings</Text>
                    <Text className='text-green-800'>Save more on every order</Text>
                </View>
                {/* <View className='p-4 bg-white flex flex-row'>
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
                </View> */}
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
            <View className='bg-white'>
                {/* <View className='flex-row justify-between pr-5'>
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
                </View> */}
                <Divider className='w-11/12 m-auto' />
                <View className='p-3 flex-row justify-between bg-white pl-6'>
                    <View className='self-center'>
                        <Text className='font-bold text-lg'>₹{total_price}</Text>
                    </View>
                    <View>
                        <ButtonCompo
                            disable={false}
                            handelClick={() => setIsOpen(true)}
                            loading={false}
                            text='PROCEED BOOKING'
                        />
                        <Drawer
                            children={<SelectedAddress navigate={navigate} setIsOpen={setIsOpen} />}
                            onClose={() => setIsOpen(false)}
                            placement="bottom"
                            isOpen={isOpen}

                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Cart


export const SelectedAddress = ({ navigate, setIsOpen, showSlot=true }: {
    navigate: NavigationProp<ReactNavigation.RootParamList>
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    showSlot?: boolean

}) => {

    const { addresses, placeName, location } = useSelector((state: RootState) => state.Location)
    const dispatch = useDispatch()
    const [selectedAddress, setSelectedAddress] = useState<null | string>(null)

    return (
        <View className='bg-white p-5 space-y-2'>
            <Text className='font-medium text-lg text-center'>Selected Address</Text>
            <View>
                {addresses.map(item => {
                    const deliverable = location?.latitude && location?.longitude ?
                        checkWithinRadius(17.3850, 78.4867, item.location.latitude, item.location.longitude) : false;
                    console.log(item.location.latitude, item.location.longitude);
                    return (
                        <Pressable onPress={() => {
                            if (!deliverable) return
                            dispatch(setPlaceName(item.addressName))
                            dispatch(setLocation(item.location))
                            setSelectedAddress(item)
                        }}>
                            <View className={!(item.addressName === selectedAddress) ? 'p-3 py-1 border-solid border-[1px] border-gray-300 rounded-lg space-y-1 bg-white my-1' : 'p-3 py-1 border-solid border-[1px] border-gray-500 bg-red-50 rounded-lg space-y-1 my-1'}>
                                {deliverable ? (<Text className='text-blue-500'>DELIVERS TO</Text>) : (<Text className='text-red-500'>DOES  NOT DELIVER TO</Text>)}
                                <Text className='text-lg font-semibold '>{item.addressName}</Text>
                                <Text>{item.placeName}</Text>
                            </View>
                        </Pressable>
                    )
                })}
            </View>
            <View>
                <Button
                    variant={'outline'}
                    onPress={() => {
                        //@ts-ignore
                        navigate.navigate('Your Location')
                        setIsOpen(false)
                    }}
                >
                    <Text>Add New Address</Text>
                </Button>
            </View>
            {showSlot && 
            <View className='mt-5'>
                <ButtonCompo
                    disable={false}
                    handelClick={() => {
                        const selectedAdd = addresses.find(item => item.addressName === selectedAddress)
                        if (!selectedAdd) return
                        //@ts-ignore
                        navigate.navigate("SlotBook")
                        setIsOpen(false)
                    }}
                    loading={false}
                    text='Select Slot'
                />
            </View>}
        </View>
    )
}

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

const checkWithinRadius = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const earthRadius = 6371; // Earth's radius in kilometers
    const distanceThreshold = 1; // 5000 meters
    const toRadians = (degrees: number) => {
        return degrees * (Math.PI / 180);
    };

    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance <= distanceThreshold;
};
