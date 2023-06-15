import { createSlice } from '@reduxjs/toolkit'

interface OrderTypesType {
    Orders: any[]
}

const initialState: OrderTypesType = {
    Orders: []
}

const OrderSlice = createSlice({
    name: 'Listings',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.Orders = action.payload
        }
    }
})

export const { setOrders } = OrderSlice.actions

export default OrderSlice.reducer