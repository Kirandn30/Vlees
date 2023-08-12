import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { db } from '../../../config'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { setOrders } from '../../redux/orderSlice'
import { Badge, Button, Icon, Modal, Pressable, TextArea } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { Rating } from 'react-native-ratings'
import { updateFeedback } from '../../services/orderService'
import { addItems } from '../../redux/CartSlice'
import { downloadInvoice } from '../../services/buildInvoice'
import {Feather ,Octicons} from '@expo/vector-icons';
import Lottie from 'lottie-react-native';


const Orders = () => {
    const { User } = useSelector((state: RootState) => state.User)
    const { Orders } = useSelector((state: RootState) => state.Orders)
    const { Products,Variants } = useSelector((state: RootState) => state.Listings)
    const [open,setOpen] = React.useState(false)
    const [selectedOrder,setSelectedOrder] = React.useState<string|null>(null)
    const [rating,setRating] = React.useState<number>(1)
    const [feedback,setFeedback] = React.useState<string|undefined>(undefined)
    const navigate = useNavigation()
    const dispatch = useDispatch()
    const [loading,setLoading] = React.useState(false)

    useEffect(() => {
        if (!User) return
        onSnapshot(query(collection(db, "Orders"), where("UserId", "==", User.uid), orderBy("date_created", "desc")), (snap) => {
            setLoading(true)
            dispatch(setOrders(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
            setLoading(false)
        })
    }, [])

    const handleSubmit = async () => {
        const res = await updateFeedback(selectedOrder!,rating,feedback)
        if(res === "success"){
            setOpen(false)
        }
        else{
            alert("Something went wrong")
        }
    }

    const handleReOrder = (order:any) => {
        var flag = false
        order.items.map((item:any) => {
            const {product,quantity,selectedVariant} = item
            //add items only if selected variant is available in Variants
            if(Variants.find((variant:any) => variant.id === selectedVariant.id)){
                flag = true
            dispatch(addItems({
                product,
                quantity,
                selectedVariant
            }))
        }
        })
        if(flag)
        navigate.navigate('Cart')
        else{
            alert("These products are not available in the store")
        }

    }

    if(loading){
        return (
            <View className='flex flex-col justify-center items-center h-full'>
                <Text className='text-black text-lg'>Loading...</Text>
            </View>
            )}

    if(!Orders.length){
        return (
            <View className='flex flex-col justify-center items-center h-full'>
                <Lottie source={require('../../../assets/not-found.json')} autoPlay loop style={{ height: 300 }} />
            </View>
            )
    }

    


    return (
        <ScrollView>
            <View className='my-5 space-y-3'>
                <Modal isOpen={open} onClose={() => {setOpen(false)}} size="lg">
                    <Modal.Content maxWidth="350px">
                        <Modal.CloseButton />
                        <Modal.Header>Rate Order</Modal.Header>
                        <Modal.Body>
                            <View className='flex-col p-5 justify-center items-center'>
                            <View className='flex-row gap-5 mb-5'>
                                        <Text>Rate the order</Text>
                                        <Rating
                                            type='custom'
                                            ratingCount={5}
                                            startingValue={rating?rating:0}
                                            minValue={0.5}
                                            jumpValue={0.5}
                                            fractions={2}
                                            imageSize={20}
                                            onFinishRating={(rating:number) => setRating(rating)}
                                            />                                   
                                    </View>
                            </View>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group variant="ghost" space={2}>
                                <Button>Cancel</Button>
                                <Button onPress={()=> {
                                    handleSubmit()
                                    }}>Submit</Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
                {Orders.map(order => (
                    
                    //@ts-ignore
                    <Pressable onPress={() => navigate.navigate('OrderId', { orderId: order.id })}>
                        <View className='bg-white mx-3 rounded-lg border-[0.5px] border-gray-300' key={order.id}>
                            <View className='absolute right-2 top-1'>
                                <View>
                                    <Badge variant="solid" colorScheme={colorMap[order.status] } style={{borderRadius:20}}><Text className="text-[10px] text-white">{order.status.toUpperCase()}</Text></Badge>
                                </View>
                            </View>
                            <View className="pt-5">
                                {order.items.map((item: any) => (
                                    <View className='flex-row gap-5 items-center mb-[5px]' key={item.id}>
                                        <Image style={{ width: 100, height: 100,borderRadius:10 }} source={{ uri: item.product.image_url[0] }} alt="image" />
                                        <View className="space-y-4">
                                            <View>
                                                <Text className='font-bold'>{item.product.name}</Text>
                                                <Text className='inline'>{item.selectedVariant.name} </Text>
                                            </View>
                                            <Text className='inline'>₹{item.selectedVariant.discountedPrice} x {item.quantity}</Text>
                                            
                                        </View>
                                        
                                    </View>
                                ))}
                            </View>
                            <Button size="xs" className='bg-gray-900  absolute bottom-[70px] right-3'  variant="solid" onPress={()=> handleReOrder(order)}>
                                    <Text className='text-white text-[10px]'>Repeat Order</Text>
                            </Button>
                            <View className='flex-row justify-evenly p-3 gap-5'>
                                <Pressable className='flex flex-row items-center w-[43%] justify-center border-[0.5px] p-2 rounded-sm' variant="outline" onPress={() =>{
                                    setOpen(true)
                                    setSelectedOrder(order.id)
                                    setRating(order.rating)
                                    setFeedback(order.feedback)
                                }}>
                                    <Icon as={Octicons } name={order.rating?"heart-fill":"heart"} size={5} color={order.rating?"red.500":"black"} />
                                    <Text className='text-black ml-1'>{order.rating?"Order Rated":"Rate Order"}</Text>
                                </Pressable>
                                
                                <Pressable className="flex flex-row items-center w-[43%] justify-center border-[0.5px] p-2 rounded-sm " onPress={()=> downloadInvoice(order.invoice)}>
                                    <Icon as={Feather } name="download" size={5} color="black" />
                                    <Text className='text-black ml-1'>Invoice</Text>
                                </Pressable>
                                
                            </View>
                        </View>
                    </Pressable>
                ))}
        </View>
        </ScrollView>
    )
}


const colorMap = {
    "created": "info",
    "delivery partner assigned":"warning",
    "dispatched":"success",
    "payment completed":"info"

}

export default Orders