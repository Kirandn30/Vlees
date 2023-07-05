import { createSlice } from '@reduxjs/toolkit'
import { User } from '@firebase/auth-types';
import { GeoPoint } from 'firebase/firestore';

interface ListingTypesType {
    Category: ICategory[],
    Products: IProductType[],
    Variants: IVariantType[],
    CategoryName: string,
    storeLocation: IStoreLocationType[],
    selectedStore: IStoreLocationType|null,
}

const initialState: ListingTypesType = {
    Category: [],
    Products: [],
    Variants: [],
    CategoryName: '',
    storeLocation: [],
    selectedStore:null
}

const ListingSlice = createSlice({
    name: 'Listings',
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state.Category = action.payload
        },
        setProducts: (state, action) => {
            state.Products = action.payload
        },
        setVariants: (state, action) => {
            state.Variants = action.payload
        },
        setCategoryName: (state, action) => {
            state.CategoryName = action.payload
        },
        setStoreLocation: (state, action) => {
            state.storeLocation = action.payload
        },
        setSelectedStore: (state, action) => {
            state.selectedStore = action.payload
        },

    }
})

export const { setCategory, setProducts, setVariants, setCategoryName, setStoreLocation, setSelectedStore } = ListingSlice.actions

export default ListingSlice.reducer

export interface IVariantType {
    id: string;
    ProductId: string;
    categoryId: string
    name: string;
    weight: number;
    unit: "gm" | "kg"
    grade?: string;
    freshness?: string;
    packaging?: string;
    originalPrice: number;
    discountedPrice: number;
    is_active: boolean;
    serves?: number;
    pieces?: number
    is_popular?: boolean;
    is_new?: boolean;
    is_discounted?: boolean;
}
export interface IRatingType {
    id: string;
    ProductId: string;
    userId: string;
    rating: number;
    comment?: string;
    date_created: string;
}

export interface ICategory {
    id: string;
    name: string;
    description?: string;
    image_url: string;
    is_featured?: boolean;
    is_active: boolean;
}

export interface IProductType extends IProductBase {
    variantes: IVariantType[]
}

export interface IProductBase {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    image_url: string[];
    is_active: boolean;
    is_popular?: boolean;
    is_new?: boolean;
    is_discounted?: boolean;
    isHalal?: boolean;
    ratings: number,
    totalRatingsNo: number,
    caption: string
}

export interface IStoreLocationType {
    id: string,
    locationName: string,
    coordinates: GeoPoint,
    address: string,
    contact: string,
    inchargeName: string,
    active: boolean
}