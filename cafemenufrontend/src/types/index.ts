

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    ingredients: string[]; // Yeni eklenen alan
    category?: Partial<Category>;
}

export interface Category {
    content: any;
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
    ingredients: string[]; // Yeni eklenen alan
    category: {
        id: number;
    };
}


export interface Logo {
    id: number;
    logoUrl: string;
}
