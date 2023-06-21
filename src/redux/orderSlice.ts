import { createSlice } from '@reduxjs/toolkit'

interface OrderTypesType {
    Orders: any[],
    getHelpOrderData: null | any
}

const initialState: OrderTypesType = {
    Orders: [],
    getHelpOrderData: null
}

const OrderSlice = createSlice({
    name: 'Listings',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.Orders = action.payload
        },
        setGetHelpOrderId: (state, action) => {
            state.getHelpOrderData = action.payload
        }
    }
})

export const { setOrders, setGetHelpOrderId } = OrderSlice.actions

export default OrderSlice.reducer