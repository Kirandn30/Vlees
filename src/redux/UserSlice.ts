import { createSlice } from '@reduxjs/toolkit'
import { User } from '@firebase/auth-types';

interface UserType {
    User: User | null,
    userDetails: any | null
}

const initialState: UserType = {
    User: null,
    userDetails: null
}

const UserSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.User = action.payload
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload
        }
    },
})

export const { setUser, setUserDetails } = UserSlice.actions

export default UserSlice.reducer