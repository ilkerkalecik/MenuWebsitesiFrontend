import { useEffect, useState } from 'react';
import { Category } from '../types/index.ts';
import { api } from '../api';
import { Coffee, Dessert, EggFried, FishSymbol, GlassWater, Heart, IceCream, Pizza, Utensils, Vegan, Wine } from 'lucide-react';

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
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
            <div className="sticky top-0 bg-white py-3 z-10 overflow-x-auto flex gap-4 px-4 border border-gray-200   whitespace-nowrap ">
                <button 
                    onClick={() => setSelectedCategory(null)} 
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${!selectedCategory ? 'bg-gray-950 text-white' : 'bg-gray-100 text-dark'}`}
                >
                    Tüm Ürünler
                </button>
                {categories.map(category => {
                    const Icon = getCategoryIcon(category.name);
                    return (
                        <button 
                            key={category.id} 
                            onClick={() => setSelectedCategory(category.name)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${selectedCategory === category.name ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-800'}`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="whitespace-nowrap">{category.name}</span>
                        </button>
                    );
                })}
            </div>
            
            {/* Ürünler Listesi */}
            {filteredCategories.map((category) => {
                const Icon = getCategoryIcon(category.name);
                return (
                    <div key={category.id} className="space-y-6">
                        <div className="flex space-x-2 mb-10">
                            <Icon className="h-8 w-8 text-black" />
                            <h2 className="text-3xl font-lightest text-black antialiased tracking-normal">{category.name}</h2>
                        </div>
                        <div className="grid grid-cols md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {category.products.map((product) => {
                                const isExpanded = expandedDescriptions[product.id] || false;
                                return (
                                    <div key={product.id} className="bg-primary rounded-lg overflow-hidden border border-black text-start flex sm:flex-col md:flex-col flex-grow">
                                        <img src={product.imageUrl} alt={product.name} className="w-5/12 md:w-full object-cover rounded border border-black" />
                                        <div className="px-4 py-6 flex flex-col space-y-1 flex-grow">
                                            <h1 className='mb-4'>{category.name}</h1>
                                            <h3 className="text-2xl font-bold text-gray-950 ">{product.name}</h3>
                                            <p className="text-gray-900 font-extralight text-sm">
                                                {isExpanded ? product.description : `${product.description.slice(0, 50)}...`}
                                            </p>
                                            {product.description.length > 50 && (
                                                <button 
                                                    onClick={() => setExpandedDescriptions(prev => ({
                                                        ...prev, 
                                                        [product.id]: !isExpanded
                                                    }))}
                                                    className="text-gray-950 hover:underline text-xs inline-block font-extrabold text-left"
                                                >
                                                    {isExpanded ? "Daha Az Göster" : "Daha Fazlasını Göster"}
                                                </button>
                                            )}
                                            <div className="flex space-x-3 items-center">
                                                <span className="text-gray-900 font-bold tracking-tighter text-2xl mt-4">{product.price.toFixed(2)} ₺</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Menu;
