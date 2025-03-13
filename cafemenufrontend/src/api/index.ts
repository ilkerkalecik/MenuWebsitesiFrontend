import axios from 'axios';
import { Category, Product, CreateProductDto, Carousel } from '../types';

const API_URL = "http://localhost:8080/api";  //http://www.ilkerkalecikmenu.shop:8080/api


export const api = {
    // Login endpoint: Backend'den token döndüğü varsayılıyor.
    login: async (credentials: { username: string; password: string }) => {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        if (response.status !== 200) {
            throw new Error('Login failed');
        }
        return response.data.token;  // Backend'in döndürdüğü JSON { token: '...' } şeklinde olmalı.
    },

    // Category endpoints

    getCategories: () => axios.get<Category[]>(`${API_URL}/category`),
    addCategory: (name: string) => axios.post(`${API_URL}/category`, { name }),
    updateCategory: (id: number, name: string) => axios.put(`${API_URL}/category/${id}`, { name }),
    deleteCategory: (id: number) => axios.delete(`${API_URL}/category/${id}`),

    // Product endpoints
    getProducts: () => axios.get<Product[]>(`${API_URL}/product`),
    getProductById: (id: number) => axios.get<Product>(`${API_URL}/product/${id}`),

    addProduct: (product: CreateProductDto) => axios.post(`${API_URL}/product`, product),
    updateProduct: (id: number, product: Partial<CreateProductDto>) =>
        axios.put(`${API_URL}/product/${id}`, product),
    deleteProduct: (id: number) => axios.delete(`${API_URL}/product/${id}`),

    // İçindekilerle birlikte ürünü almayı ekledik
    getProductWithIngredientsById: (id: number) => axios.get<Product>(`${API_URL}/product/${id}/with-ingredients`),

    uploadImage: (formData: FormData) =>
        axios.post(`${API_URL}/product/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }),

    // Admin veri çekme işlemi
    getAdminData: async () => {
        const token = localStorage.getItem("token");

        if (!token) throw new Error("No token found");

        const response = await axios.get(`${API_URL}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
            throw new Error("Unauthorized");
        }

        return response.data;
    },





    // Kategori sırası güncelleme
    updateCategoryOrder: (categories: { id: number; order: number }[]) =>
        axios.put(`${API_URL}/category/order`, { categories: categories }),

    getLogos: () => axios.get(`${API_URL}/logo`),
    addLogo: (logoUrl: string) => axios.post(`${API_URL}/logo`, { logoUrl }),
    updateLogo: (id: number, logoUrl: string) => axios.put(`${API_URL}/logo/${id}`, { logoUrl }),
    deleteLogo: (id: number) => axios.delete(`${API_URL}/logo/${id}`),


};
