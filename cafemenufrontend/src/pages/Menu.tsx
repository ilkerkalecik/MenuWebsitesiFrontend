import { useEffect, useState } from 'react';
import { Category, Logo } from '../types/index.ts';
import { api } from '../api';
import { Coffee, Dessert, EggFried, FishSymbol, GlassWater, Heart, IceCream, Pizza, Utensils, Vegan, Wine } from 'lucide-react';
import ProductModal from './ProductModal.tsx';

const getCategoryIcon = (kategoriAdi: string) => {
    const lowerKategori = kategoriAdi.toLocaleLowerCase("tr");

    if (lowerKategori.includes("soğuk içecek") || lowerKategori.includes("içecek")) return GlassWater;
    if (lowerKategori.includes("kahve") || lowerKategori.includes("sıcak içecek")) return Coffee;
    if (lowerKategori.includes("balık") || lowerKategori.includes("deniz")) return FishSymbol;
    if (lowerKategori.includes("dondurma")) return IceCream;
    if (lowerKategori.includes("salata")) return Heart;
    if (lowerKategori.includes("kebap") || lowerKategori.includes("ızgara")) return Utensils;
    if (lowerKategori.includes("pide") || lowerKategori.includes("lahmacun")) return Utensils;
    if (lowerKategori.includes("kahvaltı")) return EggFried;
    if (lowerKategori.includes("dürüm")) return Utensils;
    if (lowerKategori.includes("pizza")) return Pizza;
    if (lowerKategori.includes("alkol")) return Wine;
    if (lowerKategori.includes("tatlı")) return Dessert;
    if (lowerKategori.includes("vegan")) return Vegan;

    return Utensils;
};

const Menu = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [modalProduct, setModalProduct] = useState(null); // Modal için gösterilecek ürünü tutacak state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal'ın açık olup olmadığını kontrol etmek için durum
    const [logo, setLogo] = useState<Logo | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.getCategories();
                setCategories(response.data.sort((a, b) => a.categoryOrder - b.categoryOrder));
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (categoryName: string | null) => {
        setSelectedCategory(categoryName);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await api.getLogos();
                if (response.data && response.data.length > 0) {
                    setLogo(response.data[0]);
                }
            } catch (error) {
                console.error('Logo yüklenirken hata oluştu', error);
            }
        };
        fetchLogo();
    }, []);
    const openModal = (product: any) => {
        setModalProduct(product); // Ürün bilgilerini modal state'ine ekleyelim
        setIsModalOpen(true); // Modal'ı açıyoruz
    };

    const closeModal = () => {
        setIsModalOpen(false); // Modal'ı kapatıyoruz
        setModalProduct(null); // Modal kapandığında ürünü sıfırlıyoruz
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    const filteredCategories = selectedCategory
        ? categories.filter(category => category.name === selectedCategory)
        : categories;

    return (
        <div className="space-y-12">


            {/* Kategori Seçim Butonları */}
            <div className="sticky top-0  py-4 z-10 overflow-x-auto flex gap-2 whitespace-nowrap bg-primaryWhite scrollbar-hide ">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full font-light tracking-wide border border-neutral-100 transition-all ${!selectedCategory ? 'bg-neutral-900 text-neutral-200' : 'text-neutral-500 '}`}
                >
                    Tüm Ürünler
                </button>
                {categories.map(category => {
                    const Icon = getCategoryIcon(category.name);
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.name)}
                            className={`flex items-center capitalize gap-2 px-4 py-2 rounded-full font-light tracking-wide transition-all border border-neutral-100 ${selectedCategory === category.name ? 'bg-neutral-900 text-neutral-200' : ' text-neutral-500'}`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="whitespace-nowrap">{category.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Ürünler Listesi */}
            {filteredCategories.map((category) => (
                <div key={category.id}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 p-2 ">
                        {category.products.map((product) => (
                            <div key={product.id} className="bg-primaryWhite rounded-lg overflow-hidden flex flex-col w-full max-w-[250px] mx-auto text-center shadow-md border border-gray-200">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div className="px-4 py-6 flex flex-col space-y-2 flex-grow">
                                    <h3 className="text-xl font-light text-gray-950">{product.name}</h3>
                                    <span className="text-gray-900 font-bold tracking-tighter text-2xl">{product.price.toFixed(2)} ₺</span>
                                    <button
                                        onClick={() => openModal(product)} // Modal'ı açıyoruz
                                        className="text-xs w-full font-extrabold bg-primaryMain py-2 text-primaryWhite rounded-md"
                                    >
                                        Detayları Göster
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Modal Bileşeni */}
            {isModalOpen && modalProduct && (
                <ProductModal product={modalProduct} closeModal={closeModal} />
            )}
        </div>
    );
};

export default Menu;
