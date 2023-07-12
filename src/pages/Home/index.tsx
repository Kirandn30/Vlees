import { View,Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IProductType, setCategory, setProducts, setVariants, setStoreLocation, setSelectedStore } from '../../redux/ProductsSlice'
import Categorys from './Categorys'
import { RootState } from '../../redux'
import ProductCard from '../../components/ProductCard'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import SearchBar from '../../components/SearchBar'
import { useNavigation, } from '@react-navigation/native';
import { Divider } from 'native-base'
import { geoDistance, findClosest } from '../../services/distance'
import { setLocation, setPlaceName } from '../../redux/Mapslice'
import { SelectedAddress } from '../Cart'
import { loadData } from '../../services/loadData'
import { clearCart } from '../../redux/CartSlice'

const Home = () => {
    const dispatch = useDispatch()
    const { Products,Variants, storeLocation, selectedStore } = useSelector((state: RootState) => state.Listings)
    const { location, placeName } = useSelector((state: RootState) => state.Location)
    const deviceWidth = Dimensions.get("window").width;
    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigation()
    useEffect(() => {


        console.log("selectedStore", selectedStore?.id)

        loadData(selectedStore?.id,dispatch)
            


        /* Firebase.firestore().collection("Location").get()
        .then(res => {
            dispatch(setStoreLocation(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
        })
        
        let productIds:string[] = []
        Firebase.firestore().collection("Catogory")
            .get()
            .then(res => {
                dispatch(setCategory(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
            })
        
        Firebase.firestore().collection("Variant").where("locationId","==",selectedStore?.id)
        .get()
            .then(res => {
                productIds = res.docs.map(doc => doc.data().ProductId)
                console.log("productIds",productIds)
                dispatch(setVariants(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
                Firebase.firestore().collection("Product").where("id","in",productIds)
                .get()
                .then(res => {
                    console.log("products",res.docs.map(doc => ({ ...doc.data(), id: doc.id })))
                    const categoryIds = res.docs.map(doc => doc.data().CategoryId)
                dispatch(setProducts(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
            })
            })
 */
        
        
        
        
    }, [selectedStore])

    useEffect(() => {
        console.log("storeLocation",storeLocation.length, placeName,location)
        if(placeName!=="not granted" && placeName != "fetch" && storeLocation.length>0){
           // console.log(location)
            const closestStore = findClosest(location,storeLocation)
            console.log("closestStore",closestStore)
            dispatch(setSelectedStore(closestStore))
            dispatch(clearCart())
        }


        
    }
    ,[placeName,storeLocation.length])


    useEffect(()=>{
        console.log("Place name",placeName)
        if(!placeName || placeName==="not granted"){
            setIsOpen(true)
            
        }
        else{
            //dispatch(clearCart())
            setIsOpen(false)
        }
    },[placeName])

    const renderItem = ({ item }: { item: IProductType }) => {
        const findVariants = () => {
            return Variants.filter(variant => variant.ProductId === item.id)
        }
        if (findVariants().length > 0) {
            return (
                <>
                
                <ProductCard product={item} navigate={navigate} />
                <Divider bg="coolGray.300" thickness="1" width={deviceWidth * 0.9} className="self-center mb-1" />
                </>
            )
        } else {
            return <View></View>
        }
    }
    return (
        <View className='bg-gray-50 min-h-screen'>
            {isOpen||!placeName || placeName==="not granted"?<SelectedAddress navigate={navigate} showSlot={false} setIsOpen={setIsOpen} />:
            <ScrollView >
                <SearchBar />
                <Categorys />
                <View className='my-5'>
                    <FlatList
                        data={Products}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                    <View className='h-28'>

                    </View>
                </View>
            </ScrollView>}
        </View>
    )
}

export default Home