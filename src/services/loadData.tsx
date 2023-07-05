import { AnyAction, Dispatch } from "@reduxjs/toolkit"
import { Firebase } from "../../config"
import { IProductType, setCategory, setProducts, setVariants, setStoreLocation, setSelectedStore } from '../redux/ProductsSlice'


export const loadData = async (locationId:string|null = null, dispatch:Dispatch<AnyAction>)=>{
    console.log("locationId")
    const storeLocation = await Firebase.firestore().collection("Location").get()
    dispatch(setStoreLocation(storeLocation.docs.map(doc => ({ ...doc.data(), id: doc.id }))))

    if(locationId){
    console.log("locationId",locationId)
    const variants = await Firebase.firestore().collection("Variant").where("locationId","==",locationId).get()
    dispatch(setVariants(variants.docs.map(doc => ({ ...doc.data(), id: doc.id }))))

    console.log("variants",variants.docs.map(doc => ({ ...doc.data(), id: doc.id })))

    const productIds = variants.docs.map(doc => doc.data().ProductId)
    console.log("productIds",productIds)
    const products = await Firebase.firestore().collection("Product").where("id","in",productIds).get()
    dispatch(setProducts(products.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
    console.log("products",products.docs.map(doc => ({ ...doc.data(), id: doc.id })))

    const categoryIds = products.docs.map(doc => doc.data().categoryId)
    
    const categories = await Firebase.firestore().collection("Catogory").where("id","in",categoryIds).get()
    dispatch(setCategory(categories.docs.map(doc => ({ ...doc.data(), id: doc.id }))))}


}