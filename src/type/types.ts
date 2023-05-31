interface ICategory {
    id: string;
    name: string;
    description?: string;
    image_url: string;
    is_featured?: boolean;
    is_active: boolean;
}

interface IProductType extends IProductBase {
    variantes: IVariantType[]
}

interface IProductBase {
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

interface IVariantType {
    id: string;
    ProductId: string;
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
interface IRatingType {
    id: string;
    ProductId: string;
    userId: string;
    rating: number;
    comment?: string;
    date_created: string;
}


const categories: ICategory[] = [
    {
        id: "1",
        name: "Chicken",
        description: "Fresh chicken for your meals",
        image_url: "https://example.com/chicken.jpg",
        is_featured: true,
        is_active: true,
    },
    {
        id: "2",
        name: "Mutton",
        description: "Tender mutton for your recipes",
        image_url: "https://example.com/mutton.jpg",
        is_featured: false,
        is_active: true,
    },
    {
        id: "3",
        name: "Seafood",
        description: "Fresh seafood for your dishes",
        image_url: "https://example.com/seafood.jpg",
        is_active: false,
    },
];


const products: IProductType[] = [
    {
        id: "1",
        categoryId: "1",
        name: "Chicken Breast",
        description: "Boneless chicken breast, perfect for grilling or baking",
        image_url: ["https://example.com/chicken-breast.jpg"],
        is_active: true,
        ratings: 0,
        caption: "",
        totalRatingsNo: 1,
        variantes: [
            {
                id: "1",
                ProductId: "1",
                name: "500g, A Grade, Fresh, Pack of 4",
                weight: 500,
                unit: "gm",
                grade: "A",
                freshness: "Fresh",
                packaging: "Pack of 4",
                originalPrice: 300,
                discountedPrice: 280,
                is_active: true,
                is_popular: true,
                is_discounted: true,
            },
            {
                id: "2",
                ProductId: "1",
                name: "1kg, B Grade, Frozen, Pack of 8",
                weight: 1000,
                grade: "B",
                freshness: "Frozen",
                unit: "gm",
                packaging: "Pack of 8",
                originalPrice: 500,
                discountedPrice: 500,
                is_active: true,
                is_popular: false,
                is_discounted: false,
            }
        ]
    },
    {
        id: "2",
        categoryId: "1",
        name: "Chicken Wings",
        description: "Juicy chicken wings, great for parties or snacking",
        image_url: ["https://example.com/chicken-wings1.jpg", "https://example.com/chicken-wings2.jpg"],
        is_active: true,
        ratings: 0,
        totalRatingsNo: 1,
        caption: "",
        variantes: [
            {
                id: "3",
                ProductId: "2",
                name: "500g, Fresh, Pack of 10",
                weight: 500,
                freshness: "Fresh",
                unit: "gm",
                packaging: "Pack of 10",
                originalPrice: 200,
                discountedPrice: 200,
                is_active: true,
                is_popular: false,
                is_discounted: false,
            },
            {
                id: "4",
                ProductId: "2",
                name: "1kg, Frozen, Pack of 20",
                weight: 1000,
                freshness: "Frozen",
                packaging: "Pack of 20",
                unit: "gm",
                originalPrice: 350,
                discountedPrice: 300,
                is_active: true,
                is_popular: true,
                is_discounted: true,
            }
        ]
    },
    {
        id: "3",
        categoryId: "2",
        name: "Goat Curry Cut",
        description: "Tender goat meat, cut into curry pieces",
        image_url: ["https://example.com/goat-curry-cut.jpg"],
        is_active: true,
        totalRatingsNo: 1,
        ratings: 0,
        caption: "",
        variantes: [
            {
                id: "5",
                ProductId: "3",
                name: "500g, Fresh, Pack of 4",
                weight: 500,
                freshness: "Fresh",
                packaging: "Pack of 4",
                unit: "gm",
                originalPrice: 400,
                discountedPrice: 400,
                is_active: true,
                is_popular: true,
                is_discounted: false,
            },
            {
                id: "6",
                ProductId: "3",
                name: "1kg, Frozen, Pack of 8",
                weight: 1000,
                unit: "gm",
                freshness: "Frozen",
                packaging: "Pack of 8",
                originalPrice: 700,
                discountedPrice: 650,
                is_active: false,
            }
        ]
    },
    {
        id: "4",
        categoryId: "2",
        name: "Goat Mince",
        description: "Ground goat meat, perfect for kebabs or curries",
        image_url: ["https://example.com/goat-mince1.jpg", "https://example.com/goat-mince2.jpg"],
        is_active: true,
        caption: "",
        totalRatingsNo: 1,
        ratings: 0,
        variantes: [
            {
                id: "7",
                ProductId: "4",
                name: "500g, Fresh, Pack of 10",
                weight: 500,
                freshness: "Fresh",
                packaging: "Pack of 10",
                originalPrice: 250,
                unit: "gm",
                discountedPrice: 250,
                is_active: true,
                is_popular: false,
                is_discounted: false,
            },
            {
                id: "8",
                ProductId: "4",
                name: "1kg, Frozen, Pack of 20",
                weight: 1000,
                freshness: "Frozen",
                packaging: "Pack of 20",
                originalPrice: 450,
                unit: "gm",
                discountedPrice: 400,
                is_active: true,
                is_popular: true,
                is_discounted: true,
            }
        ]
    },
    {
        id: "5",
        categoryId: "3",
        name: "Prawns",
        totalRatingsNo: 1,
        description: "Fresh, succulent prawns, great for seafood lovers",
        image_url: ["https://example.com/prawns.jpg"],
        is_active: false,
        ratings: 0,
        caption: "",
        variantes: [
            {
                id: "9",
                ProductId: "5",
                name: "500g, Fresh, Pack of 4",
                weight: 500,
                freshness: "Fresh",
                packaging: "Pack of 4",
                originalPrice: 500,
                unit: "gm",
                discountedPrice: 500,
                is_active: false,
            },
            {
                id: "10",
                ProductId: "5",
                name: "1kg, Frozen, Pack of 8",
                weight: 1000,
                freshness: "Frozen",
                packaging: "Pack of 8",
                originalPrice: 800,
                discountedPrice: 750,
                unit: "gm",
                is_active: true,
                is_new: true,
                is_discounted: false,
            },
        ]
    },
    {
        id: "6",
        categoryId: "3",
        name: "Salmon Fillet",
        description: "Fresh salmon fillet, perfect for grilling or baking",
        image_url: ["https://example.com/salmon-fillet.jpg"],
        is_active: true,
        ratings: 0,
        caption: "",
        totalRatingsNo: 1,
        variantes: [
            {
                id: "11",
                ProductId: "6",
                name: "500g, Fresh, Pack of 2",
                weight: 500,
                freshness: "Fresh",
                unit: "gm",
                packaging: "Pack of 2",
                originalPrice: 700,
                discountedPrice: 700,
                is_active: false,
            },
            {
                id: "12",
                ProductId: "6",
                name: "1kg, Frozen, Pack of 4",
                weight: 1000,
                freshness: "Frozen",
                packaging: "Pack of 4",
                originalPrice: 1200,
                discountedPrice: 1100,
                unit: "gm",
                is_active: true,
                is_popular: true,
                is_discounted: true,
            },
        ]
    },
];


interface ICartType {
    items: {
        product: IProductBase;
        quantity: number;
        selectedVariant: IVariantType
    }[];
    total_items: number;
    total_price: number;
}

interface IOrderType {
    id: string;
    items: {
        product: IProductBase;
        quantity: number;
        selectedVariant: IVariantType
    }[];
    total_items: number;
    total_price: number;
    invoice: {},
    payment_details: {},
    shipping_address: {
        name: string;
        phone: string;
        email: string;
        address_line_1: string;
        address_line_2?: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
        placeId: string;
        lat: number;
        log: number;
        formatted_address: string
    };
    payment_method: string;
    status: string;
    date_created: string;
}

