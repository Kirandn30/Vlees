import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { AlertDialog, Button, Divider, Drawer } from 'native-base'
import { Form, FormValues } from '../components/MapComponent'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config'
import { clearCart } from '../redux/CartSlice'
import { setPlaceName, setLocation, updateAddress, deleteAddress } from '../redux/Mapslice'
import { useDispatch } from 'react-redux'

const MangageAddress = () => {

    const { addresses } = useSelector((state: RootState) => state.Location)
    const [isOpen, setIsOpen] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [currentAdress, setCurrentAdress] = React.useState<any>({})
    const [loading, setLoading] = React.useState(false)
    const dispatch = useDispatch()
    const { User } = useSelector((state: RootState) => state.User)
    const cancelRef = React.useRef(null);
    const onClose = () => {
        setCurrentAdress({})
        setOpen(false)};

    const handleSubmit = (values: FormValues) => {
        console.log(values)
        if (!User) return
        setLoading(true)
        updateDoc(doc(db,"Address",currentAdress.id),{
            ...currentAdress,...values
        }).finally(() => {
            dispatch(updateAddress({...currentAdress,...values}))
            setLoading(false)
            setIsOpen(false)
        })

    };

    const handleSubmitDelete = () => {
        console.log("it",currentAdress)
        if (!User) return
        deleteDoc(doc(db, 'Address', currentAdress.id)).then(() => {
        setLoading(true)
        dispatch(deleteAddress(currentAdress))
        setOpen(false)}).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }


    return (
        <View className='p-5'>
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={open} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>This will delete your address</AlertDialog.Header>
                    <AlertDialog.Body>
                        Please note that this action will permanently delete your address. To proceed, click the "Confirm" button.
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                        <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                            Cancel
                        </Button>
                        <Button colorScheme="danger" onPress={()=>handleSubmitDelete()}>
                            Confirm
                        </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
            <Text className='text-lg font-medium text-center'>Mangage Address</Text>
            <ScrollView className='my-3'>
            {addresses.map(item => (
                <View className='bg-white p-2 rounded-lg my-3'>
                    <Text className='text-base font-medium'>{item.addressName}</Text>
                    <Text>{item.houseFlatNo}</Text>
                    <Text>{item.buildingName}</Text>
                    <Text>{item.placeName}</Text>
                    <Divider className='my-3' />
                    <View className='flex-row'>
                        <Button variant={'unstyled'} className='grow' onPress={()=>{
                            setCurrentAdress(item)
                            setOpen(true)
                            }}>
                            <Text className='text-red-500'>Delete</Text>
                        </Button>
                        <Button variant={'unstyled'} onPress={()=> {
                            console.log("a")
                            setCurrentAdress(item)
                        setIsOpen(true)}} className='grow'>
                            <Text className='text-blue-500'>Edit</Text>
                        </Button>
                    </View>
                </View>
            ))}
            </ScrollView>
            <Drawer
                    children={<Form
                        currentAdress={currentAdress}
                        handleSubmit={handleSubmit}
                        loading={loading}
                    />}
                    onClose={() => {
                        setCurrentAdress({})
                        setIsOpen(false)}}
                    placement="bottom"
                    isOpen={isOpen}
                />
        </View>
    )
}

export default MangageAddress