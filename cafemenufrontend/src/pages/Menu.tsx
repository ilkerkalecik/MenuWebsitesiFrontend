import { useEffect, useState } from 'react';
import { Category } from '../types/index.ts';
import { api } from '../api';
import { Coffee, Dessert, EggFried, FishSymbol, GlassWater, Heart, IceCream, Pizza, Utensils, Vegan, Wine, ChevronUp } from 'lucide-react';
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
    const [modalProduct, setModalProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false); // Yukarı çık butonu için state

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

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleCategoryChange = (categoryName: string | null) => {
        setSelectedCategory(categoryName);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openModal = (product: any) => {
        setModalProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalProduct(null);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div className="sticky top-0   py-4 z-10 mt-14 overflow-x-auto flex gap-2 whitespace-nowrap  scrollbar-hide  bg-secondaryWhite">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full font-light tracking-wide border border-neutral-300 transition-all ${!selectedCategory ? 'bg-neutral-900 text-neutral-200' : 'text-neutral-500 '}`}
                >
                    Tüm Ürünler
                </button>
                {categories.map(category => {
                    const Icon = getCategoryIcon(category.name);
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.name)}
                            className={`flex items-center capitalize gap-2 px-4 py-2 rounded-full border border-neutral-300  font-light tracking-wide transition-all  ${selectedCategory === category.name ? 'bg-neutral-900 text-neutral-200' : ' text-neutral-500'}`}
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
                    <div className="relative flex items-center justify-center my-10">
                        <div className="flex-grow border-t border-neutral-400"></div>
                        <h2 className="px-6 text-3xl font-extralight text-neutral-800 tracking-widest capitalize">
                            {category.name}
                        </h2>
                        <div className="flex-grow border-t border-neutral-400"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                        {category.products.map((product) => (
                            <div key={product.id} className="flex flex-row items-center  space-x-4 w-full">
                                <h1 className="font-extralight text-xs tracking-wider">{product.name}</h1>
                                <div className="flex-grow border-dotted border-t border-neutral-400"></div>
                                <p className="font-bold text-neutral-950 text-xs">{product.price.toFixed(2)} ₺</p>
                                <button
                                    onClick={() => openModal(product)}
                                    className="text-xs font-semibold  py-1 px-3 text-neutral-600 underline rounded-md hover:bg-primaryDark transition-all "
                                >
                                    Detaylar...
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            ))} 

            {/* Modal Bileşeni */}
            {isModalOpen && modalProduct && (
                <ProductModal product={modalProduct} closeModal={closeModal} />
            )}

            {/* Yukarı Çık Butonu */}
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-10 right-5 p-3 bg-neutral-800 text-white rounded-full shadow-lg transition-opacity duration-300 ease-in-out"
                >
                    <ChevronUp size={24} />
                </button>
            )}
        </div>
    );
};

export default Menu;
