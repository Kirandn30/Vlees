import { GestureResponderEvent, View } from 'react-native'
import React, { useEffect } from 'react'
import { Firebase } from '../../../config'
import { useDispatch, useSelector } from 'react-redux'
import { IProductType, setCategory, setProducts } from '../../redux/ProductsSlice'
import Categorys from './Categorys'
import { RootState } from '../../redux'
import ProductCard from '../../components/ProductCard'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import ButtomNavBar from '../../components/ButtomNavBar'
import { Text, Button } from 'native-base'
import SearchBar from '../../components/SearchBar'
import ShowCartDetails from '../../components/ShowCartDetails'
import ButtonCompo from '../../components/button'
import { openAppSettings } from '../../components/GetLocation'
import { RouteProp, useNavigation, } from '@react-navigation/native';


type RootStackParamList = {
    Home: { getLocFunc: ((event: GestureResponderEvent) => void) | null | undefined };
};

type Props = {
    route: RouteProp<RootStackParamList, 'Home'>;
}

const Home: any = ({ route }: Props) => {
    const dispatch = useDispatch()
    const { Products } = useSelector((state: RootState) => state.Listings)
    const { placeName } = useSelector((state: RootState) => state.Location)

    const navigate = useNavigation()
    useEffect(() => {
        Firebase.firestore().collection("Catogory").get()
            .then(res => {
                dispatch(setCategory(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
            })
        Firebase.firestore().collection("Product").get()
            .then(res => {
                dispatch(setProducts(res.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
            })
    }, [])

    const renderItem = ({ item }: { item: IProductType }) => {
        if (item.variantes.length > 0) {
            return (
                <ProductCard product={item} navigate={navigate} />
            )
        } else {
            return <View></View>
        }
    }
    console.log(route.params.getLocFunc);

    return (
        <View className='bg-gray-50 flex-1 justify-between items-center'>
            {placeName !== "not granted" ? <View>
                <ScrollView >
                    <SearchBar />
                    <Categorys />
                    <FlatList
                        data={Products}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                </ScrollView>
                <ShowCartDetails />
            </View> :
                <View className='flex-1 justify-center items-center'>
                    <Text className='p-5'>Location Permission Requried</Text>
                    <View className='flex-row '>
                        <Button
                            variant="outline"
                            color="black"
                            className='mr-5'
                            onPress={route.params.getLocFunc}
                        >Try Again</Button>
                        <ButtonCompo
                            disable={false}
                            handelClick={openAppSettings}
                            loading={false}
                            text='Give Access'
                        />
                    </View>
                </View>
            }
        </View>
    )
}

export default Home