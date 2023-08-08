import { createSlice } from '@reduxjs/toolkit'
import { db } from '../../config'
import { deleteDoc, doc } from 'firebase/firestore'

interface MapsType {
    location: {
        latitude: number
        latitudeDelta?: number
        longitude: number
        longitudeDelta?: number
    } | null,
    placeName: null | string,
    locationCopy: {
        latitude: number
        latitudeDelta?: number
        longitude: number
        longitudeDelta?: number
    } | null,
    placeNameCopy: null | string,
    addresses: any[],
    fetchinglocation: boolean
}

const initialState: MapsType = {
    location: null,
    placeName: null,
    addresses: [],
    locationCopy: null,
    placeNameCopy: null,
    fetchinglocation: false,
}

const LocationSlice = createSlice({
    name: 'Location',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            state.location = action.payload
        },
        setPlaceName: (state, action) => {
            state.placeName = action.payload
        },
        setAddresses: (state, action) => {
            state.addresses = action.payload
        },
        setLocationCopy: (state, action) => {
            state.locationCopy = action.payload
        },
        setPlaceNameCopy: (state, action) => {
            state.placeNameCopy = action.payload
        },
        setFetchingLocation: (state, action) => {
            state.fetchinglocation = action.payload
        },
        updateAddress: (state, action) => {
            const id = action.payload.id
            const index = state.addresses.findIndex((address) => address.id === id)
            if (state.addresses[index].addressName === state.placeName){
                state.placeName = action.payload.addressName
            }
            state.addresses[index] = action.payload
        },
        deleteAddress: (state, action) => {
            const id = action.payload.id
            if(state.placeName === action.payload.addressName){
                state.placeName = "not granted"
            }
            const index = state.addresses.findIndex((address) => address.id === id)
            state.addresses.splice(index, 1)
          

        }


    },
})

export const { setLocation, setPlaceName, setAddresses, setLocationCopy, setPlaceNameCopy, setFetchingLocation, updateAddress, deleteAddress} = LocationSlice.actions

export default LocationSlice.reducer