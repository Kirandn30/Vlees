import { createSlice } from '@reduxjs/toolkit'
import { IProductBase, IVariantType } from './ProductsSlice'

const initialState: ICartType = {
    items: [],
    total_items: 0,
    total_price: 0
}

const CartSlice = createSlice({
    name: 'Cart',
    initialState,
    reducers: {
        addItems: (state, action) => {
            const { product, quantity, selectedVariant } = action.payload;
            console.log(product);

            const existingItem = state.items.find(
                (item) => item.product.id === product.id && item.selectedVariant.id === selectedVariant.id
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ product, quantity, selectedVariant });
            }

            state.total_items += quantity;
            state.total_price += selectedVariant.discountedPrice * quantity;
        },
        removeItems: (state, action) => {
            const { product, quantity, selectedVariant } = action.payload;
            const existingItem = state.items.find(
                (item) => item.product.id === product.id && item.selectedVariant.id === selectedVariant.id
            );

            if (existingItem) {
                if (existingItem.quantity <= quantity) {
                    state.items = state.items.filter(
                        (item) => item.product.id !== product.id || item.selectedVariant.id !== selectedVariant.id
                    );
                } else {
                    existingItem.quantity -= quantity;
                }

                state.total_items -= quantity;
                state.total_price -= selectedVariant.discountedPrice * quantity;
            }
        }, 
        clearCart: (state, action) => {
            state.items = action.payload.items
            state.total_items = action.payload.total_items
            state.total_price = action.payload.total_price
        }
    },
})

export const { addItems, removeItems, clearCart } = CartSlice.actions

export default CartSlice.reducer

interface ICartType {
    items: {
        product: IProductBase;
        quantity: number;
        selectedVariant: IVariantType,
    }[];
    total_items: number;
    total_price: number;
}