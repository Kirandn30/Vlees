import { createSlice } from '@reduxjs/toolkit'

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
    addresses: any[]
}

const initialState: MapsType = {
    location: null,
    placeName: null,
    addresses: [],
    locationCopy: null,
    placeNameCopy: null
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

    },
})

export const { setLocation, setPlaceName, setAddresses, setLocationCopy, setPlaceNameCopy } = LocationSlice.actions

export default LocationSlice.reducer