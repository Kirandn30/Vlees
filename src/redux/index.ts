import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './UserSlice'
import LocationSlice from "./Mapslice"
import ListingSlice from "./ProductsSlice"
import CartSlice from './CartSlice'
import orderSlice from './orderSlice'

export const store = configureStore({
    reducer: {
        User: UserSlice,
        Location: LocationSlice,
        Listings: ListingSlice,
        Cart: CartSlice,
        Orders: orderSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch