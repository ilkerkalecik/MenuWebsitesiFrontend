//types/index.ts

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    category?: Partial<Category>;
}

export interface Category {
    id: number;
    name: string;
    categoryOrder: number;
    products: Product[];
}

// Type for creating a new product
export interface CreateProductDto {
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    category: {
        id: number;
    };


}

export interface Logo {
    id: number;
    logoUrl: string;
}
