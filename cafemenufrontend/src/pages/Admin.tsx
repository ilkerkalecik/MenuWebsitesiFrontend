import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Category, Product, Logo, CreateProductDto, Carousel } from '../types';
import { api } from '../api';
import { PlusCircle, Edit2, Trash2, GripVertical, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Coffee, Dessert, EggFried, FishSymbol, GlassWater, Heart, IceCream, Pizza, Utensils, Vegan, Wine, ChevronUp } from 'lucide-react';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ProductUpdateModal from './ProductUptadeModal';



const Admin = () => {   
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [logos, setLogos] = useState<Logo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingLogo, setEditingLogo] = useState<{ id: number; logoUrl: string; imageFile: File | null } | null>(null);
    const [editingImageFile, setEditingImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    useEffect(() => {
        if (editingImageFile) {
            const url = URL.createObjectURL(editingImageFile);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImagePreview(null);
        }
    }, [editingImageFile]);

    const filteredCategories = selectedCategory
        ? categories.filter(category => category.name === selectedCategory)
        : categories;
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProduct, setNewProduct] = useState({
        id: 0,  // ID alanını ekledik

        name: '',
        price: 0,
        imageUrl: '',
        description: '',
        categoryId: 0,
        ingredients: [] as string[],
        imageFile: null as File | null,
    });

    const [newLogo, setNewLogo] = useState<{ logoUrl: string; imageFile: File | null }>({
        logoUrl: '',
        imageFile: null,
    });
    const handleCategoryChange = (categoryName: string | null) => {
        setSelectedCategory(categoryName);

    };
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab: 'products' | 'logos' | 'categories' | 'carousels' = location.pathname.includes('products')
        ? 'products'
        : location.pathname.includes('logos')
            ? 'logos'
            : location.pathname.includes('carousels')
                ? 'carousels'
                : 'categories';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [categoriesRes, productsRes, logosRes] = await Promise.all([
                api.getCategories(),
                api.getProducts(),
                api.getLogos(),
            ]);
            setCategories(categoriesRes.data.sort((a, b) => a.categoryOrder - b.categoryOrder));
            setProducts(productsRes.data);
            setLogos(logosRes.data);
        } catch (error) {
            toast.error('Veriler getirilirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // Kategori sıralaması
    const updatedCategories = categories.map((category, index) => ({
        ...category,
        order: index, // sıralamayı güncelle
    }));

    try {
        api.updateCategoryOrder(updatedCategories);
    } catch (error) {
        fetchData(); // Orijinal sıralamayı geri yükle
    }

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return; // Hedef yoksa işlem yapma

        const reorderedCategories = Array.from(categories);
        const [movedItem] = reorderedCategories.splice(result.source.index, 1);
        reorderedCategories.splice(result.destination.index, 0, movedItem);

        const updatedCategories = reorderedCategories.map((category, index) => ({
            ...category,
            categoryOrder: index,
        }));
        setCategories(updatedCategories);

        try {
            await api.updateCategoryOrder(
                updatedCategories.map((category) => ({
                    id: category.id,
                    order: category.categoryOrder,
                }))
            );
            toast.success('Kategoriler başarıyla sıralandı');
        } catch (error) {
            toast.error('Kategoriler sıralanırken bir hata oluştu');
            fetchData();
        }
    };

    // Ürün fotoğrafı için dosya seçimi
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setNewProduct((prev) => ({
                ...prev,
                imageFile: file,
            }));
        }
    };
    const removeFile = () => {
        setNewProduct((prev) => ({
            ...prev,
            imageFile: null,
        }));
    };


    // Logo dosyası için dosya seçimi (ekleme)
    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setNewLogo((prev) => ({ ...prev, imageFile: file }));
        }
    };

    // Logo düzenleme modunda dosya değişikliği
    const handleEditingLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && editingLogo) {
            setEditingLogo({ ...editingLogo, imageFile: file });
        }
    };

    const handleAddCategory = async () => {
        try {
            await api.addCategory(newCategoryName);
            toast.success('Kategori başarıyla eklendi');
            fetchData();
            setNewCategoryName('');
        } catch (error) {
            toast.error('Kategori eklenirken bir hata oluştu');
        }
    };

    const handleUpdateCategory = async (id: number, name: string) => {
        try {
            await api.updateCategory(id, name);
            toast.success('Kategori başarıyla güncellendi');
            fetchData();
            setEditingCategory(null);
        } catch (error) {
            toast.error('Kategori güncellenirken bir hata oluştu');
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz? Bu kategoriye ait tüm ürünler silinecektir'))
            return;
        try {
            await api.deleteCategory(id);
            toast.success('Kategori başarıyla silindi');
            fetchData();
        } catch (error) {
            toast.error('Kategori silinirken bir hata oluştu');
        }
    };

    const deleteProduct = async (id: number) => {
        if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
        try {
            await api.deleteProduct(id);
            toast.success('Ürün başarıyla silindi');
            fetchData();
        } catch (error) {
            toast.error('Ürün silinirken bir hata oluştu');
        }
    };

    const handleAddProduct = async () => {
        let imageUrl = '';

        if (newProduct.imageFile) {
            try {
                const formData = new FormData();
                formData.append('file', newProduct.imageFile);
                const uploadRes = await api.uploadImage(formData);
                imageUrl = uploadRes.data.url;
            } catch (error) {
                toast.error('Fotoğraf yüklenirken bir hata oluştu');
                return;
            }
        } else {
            imageUrl = 'https://www.konyaekspres.com/images/haberler/2019/10/fotograf-sanatcilarindan-harika-fotograflar.jpg';
        }

        try {
            await api.addProduct({
                name: newProduct.name,
                price: newProduct.price,
                imageUrl,
                description: newProduct.description,
                category: { id: newProduct.categoryId },
                ingredients: newProduct.ingredients, // ingredients alanını ekleyin
            });
            toast.success('Ürün başarıyla eklendi');
            fetchData();
            setNewProduct({
                id: 0,  // ID alanını ekledik

                name: '',
                price: 0,
                imageUrl: '',
                description: '',
                categoryId: 0,
                ingredients: [], // ingredients alanını sıfırlayın
                imageFile: null,
            });
        } catch (error) {
            toast.error('Ürün eklenirken bir hata oluştu');
        }
    };

    const handleUpdateProduct = async (updatedProduct: CreateProductDto) => {
        if (!editingProduct) return;

        try {
            // Direkt updatedProduct.imageUrl'yi kullanın (zaten yüklenmiş URL içeriyor)
            await api.updateProduct(editingProduct.id, updatedProduct);
            toast.success('Ürün başarıyla güncellendi');
            fetchData();
            setEditingProduct(null);
        } catch (error) {
            toast.error('Ürün güncellenirken bir hata oluştu');
        }
    };

    // Logo işlemleri
    const handleAddLogo = async () => {
        let logoUrl = '';
        if (newLogo.imageFile) {
            try {
                const formData = new FormData();
                formData.append('file', newLogo.imageFile);
                const uploadRes = await api.uploadImage(formData);
                logoUrl = uploadRes.data.url;
            } catch (error) {
                toast.error('Logo yüklenirken bir hata oluştu');
                return;
            }
        } else {
            logoUrl = 'https://via.placeholder.com/300x150.png?text=Logo';
        }

        try {
            await api.addLogo(logoUrl);
            toast.success('Logo başarıyla eklendi');
            fetchData();
            setNewLogo({ logoUrl: '', imageFile: null });
        } catch (error) {
            toast.error('Logo eklenirken bir hata oluştu');
        }
    };

    const handleUpdateLogo = async (id: number) => {
        if (!editingLogo) return;
        let logoUrl = editingLogo.logoUrl;
        if (editingLogo.imageFile) {
            try {
                const formData = new FormData();
                formData.append('file', editingLogo.imageFile);
                const uploadRes = await api.uploadImage(formData);
                logoUrl = uploadRes.data.url;
            } catch (error) {
                toast.error('Logo güncellenirken hata oluştu');
                return;
            }
        }
        try {
            await api.updateLogo(id, logoUrl);
            toast.success('Logo başarıyla güncellendi');
            fetchData();
            setEditingLogo(null);
        } catch (error) {
            toast.error('Logo güncellenirken bir hata oluştu');
        }
    };

    const handleDeleteLogo = async (id: number) => {
        if (!window.confirm('Bu logoyu silmek istediğinize emin misiniz?')) return;
        try {
            await api.deleteLogo(id);
            toast.success('Logo başarıyla silindi');
            fetchData();
        } catch (error) {
            toast.error('Logo silinirken bir hata oluştu');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Çıkış yapıldı');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-500"></div>
            </div>
        );
    }



    return (
        <div className="space-y-10 max-w-screen-xl mx-auto container p-2 overflow-hidden">
            <div className="flex justify-end">
                <button
                    onClick={handleLogout}
                    className="bg-mainColor text-sm  text-neutral-50 px-4 py-3 mt-2 rounded hover:shadow-lg  tracking-wider "
                >
                    Çıkış Yap
                </button>
            </div>

            <div className="overflow-x-auto whitespace-nowrap px-4 pb-2 scrollbar-hide">
                <div className="flex space-x-6 tracking-wider ">
                    <Link
                        to="/admin"
                        className={`pb-2 px-4 ${activeTab === 'categories'
                            ? 'border-b-2 border-mainColor text-mainColor'
                            : 'text-neutral-900'
                            }`}
                    >
                        Kategoriler
                    </Link>
                    <Link
                        to="/admin/products"
                        className={`pb-2 px-4 ${activeTab === 'products'
                            ? 'border-b-2 border-mainColor text-mainColor'
                            : 'text-neutral-600'
                            }`}
                    >
                        Ürünler
                    </Link>
                    <Link
                        to="/admin/logos"
                        className={`pb-2 px-4 ${activeTab === 'logos'
                            ? 'border-b-2 border-mainColor text-mainColor'
                            : 'text-neutral-600'
                            }`}
                    >
                        Logo
                    </Link>
                   
                </div>
            </div>


            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Yeni kategori ismi giriniz"
                                    className="flex-1 p-2 border border-neutral-300 rounded tracking-wide  focus:border-neutral-900 outline-none bg-neutral-50"
                                />

                                <button
                                    onClick={handleAddCategory}
                                    className="bg-mainColor text-white px-4 py-2 rounded hover:shadow-2xl "
                                >
                                    <PlusCircle className="h-5 w-5 m-0.5" />
                                </button>
                            </div>

                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="categories">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-3"
                                        >
                                            {categories.map((category, index) => (
                                                <Draggable
                                                    key={category.id}
                                                    draggableId={category.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className="flex items-center justify-between bg-neutral-100 p-4 rounded-lg shadow"
                                                        >
                                                            <div className="flex items-center flex-1">
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="mr-3 cursor-grab"
                                                                >
                                                                    <GripVertical className="h-5 w-5 text-neutral-600" />
                                                                </div>
                                                                {editingCategory?.id === category.id ? (
                                                                    <input
                                                                        type="text"
                                                                        value={editingCategory.name}
                                                                        onChange={(e) =>
                                                                            setEditingCategory({ ...editingCategory, name: e.target.value })
                                                                        }
                                                                        className="flex-1 p-2 border focus:border-black outline-none  rounded bg-white mr-4  tracking-wide text-neutral-950"
                                                                    />
                                                                ) : (
                                                                    <span className=" tracking-wide text-neutral-700">{category.name}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex space-x-4" >
                                                                {editingCategory?.id === category.id ? (
                                                                    <button
                                                                        onClick={() => handleUpdateCategory(category.id, editingCategory.name)}
                                                                        className="text-neutral-800  hover:text-neutral-950 hover:shadow-2xl font-medium tracking-wider"
                                                                    >
                                                                        Kaydet
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setEditingCategory(category)}
                                                                        className="text-mainColor hover:shadow-2xl"
                                                                    >
                                                                        <Edit2 className="h-5 w-5" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDeleteCategory(category.id)}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <div className="space-y-6 mx-auto text-sm ">
                            {/* Ürün Ekleme Formu */}
                            <div className="flex flex-col space-y-3 tracking-wide">
                                {/* Ürün ismi ve fiyat yan yana */}
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) =>
                                            setNewProduct({ ...newProduct, name: e.target.value })
                                        }
                                        placeholder="Ürün ismi"
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-600 outline-none bg-neutral-50"
                                    />
                                    <input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                price: parseFloat(e.target.value),
                                            })
                                        }
                                        placeholder="Fiyat"
                                        className="w-40 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-600 outline-none bg-neutral-50"
                                    />
                                </div>

                                {/* Fotoğraf Yükleme ve Kaldır Butonu */}
                                <div className="flex items-center space-x-3">
                                    <label className="flex-1 flex items-center justify-center p-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all">
                                        <input
                                            type="file"
                                            accept=".png, .jpeg, .jpg"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        {newProduct.imageFile ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle size={20} />
                                                <span className="truncate max-w-[150px] text-sm">
                                                    {newProduct.imageFile.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600">
                                                Ürün Fotoğrafı Yükle (.jpeg .jpg .png)
                                            </span>
                                        )}
                                    </label>
                                    {newProduct.imageFile && (
                                        <button
                                            onClick={removeFile}
                                            className="flex items-center gap-1 text-white text-xs tracking-wider font-thin  transition-all bg-mainColor p-3  rounded-lg"
                                        >
                                            <XCircle size={16} /> Kaldır
                                        </button>
                                    )}
                                </div>

                                {/* Kategori Seçme */}
                                <select
                                    value={newProduct.categoryId}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            categoryId: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-600 outline-none bg-neutral-50"
                                >
                                    <option value={0}>Kategori seç</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Ürün Açıklaması */}
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, description: e.target.value })
                                    }
                                    placeholder="Ürün açıklaması"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-600 outline-none bg-neutral-50"
                                    rows={3}
                                />

                                {/* İçindekiler */}
                                <textarea
                                    value={newProduct.ingredients.join(', ')}
                                    onChange={(e) => {
                                        const ingredients = e.target.value
                                            .split(',')
                                            .map((ingredient) => ingredient.trim());
                                        setNewProduct({ ...newProduct, ingredients });
                                    }}
                                    placeholder="İçindekiler (Virgülle ayırın)"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-600 outline-none bg-neutral-50"
                                    rows={2}
                                />

                                {/* Ürünü Ekle Butonu */}
                                <button
                                    onClick={handleAddProduct}
                                    className="w-full bg-mainColor text-neutral-50 tracking-wider px-6 py-3 rounded-lg transition-all"
                                >
                                    Ürünü Ekle
                                </button>
                            </div>

                            {/* Kategori Butonları */}
                            <div className="space-y-8">
                                <div className="sticky top-0 py-4 z-10 mt-10 overflow-x-auto flex gap-2 whitespace-nowrap scrollbar-hide bg-secondaryWhite">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`px-4 py-2 rounded-full  tracking-wide border border-neutral-300 transition-all ${!selectedCategory
                                            ? 'bg-mainColor text-neutral-200'
                                            : 'text-neutral-500'
                                            }`}
                                    >
                                        Tüm Ürünler
                                    </button>
                                    {categories.map((category) => {
                                        const Icon = getCategoryIcon(category.name);
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryChange(category.name)}
                                                className={`flex items-center capitalize gap-2 px-4 py-2 rounded-full border border-neutral-300  tracking-wide transition-all ${selectedCategory === category.name
                                                    ? 'bg-mainColor text-neutral-200'
                                                    : 'text-neutral-500'
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span className="whitespace-nowrap">{category.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Kategorilere Göre Filtrelenmiş Ürünler */}
                                {categories.map((category) => {
                                    const filteredProducts =
                                        selectedCategory === null || selectedCategory === category.name
                                            ? category.products
                                            : [];


                                    return (
                                        filteredProducts.length > 0 && (
                                            <div key={category.id}>
                                                <h2 className="text-xl font-semibold text-mainColor mb-4">
                                                    {category.name}
                                                </h2>
                                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3">
                                                    {filteredProducts.map((product) => (
                                                        <div
                                                            key={product.id}
                                                            className="bg-neutral-50 rounded overflow-hidden border border-neutral-300"
                                                        >
                                                            <div className="p-4 flex items-center justify-center space-x-4">
                                                                <div className="flex flex-row items-center space-x-4 w-full">
                                                                    <h1 className="text-mainColor text-xs font-semibold tracking-wider">
                                                                        {product.name}
                                                                    </h1>
                                                                    <div className="flex-grow border-dotted border-t border-neutral-400"></div>
                                                                    <p className="font-bold text-mainColor text-xs">
                                                                        {product.price.toFixed(2)} ₺
                                                                    </p>
                                                                </div>
                                                                <div className="flex space-x-2 items-center justify-center">
                                                                    <button
                                                                        onClick={() => setEditingProduct(product)}
                                                                        className="text-mainColor transition-all"
                                                                    >
                                                                        <Edit2 className="h-5 w-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteProduct(product.id)}
                                                                        className="text-red-600 hover:text-red-700 transition-all"
                                                                    >
                                                                        <Trash2 className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    );

                                })}
                            </div>

                            {/* Ürün Güncelleme Modal'ı (Tek bir kez, sayfa genelinde) */}
                            {editingProduct && (
                                <ProductUpdateModal
                                    product={editingProduct}
                                    onClose={() => setEditingProduct(null)}
                                    onUpdate={handleUpdateProduct}
                                />
                            )}
                        </div>
                    }
                />


                <Route
                    path="/logos"
                    element={
                        <div className="space-y-6">
                            {logos.length === 0 ? (
                                <div className="flex flex-col space-y-7 items-center space-x-4">
                                    <input
                                        type="file"
                                        accept=".png, .jpeg, .jpg"
                                        onChange={handleLogoFileChange}
                                        className="p-2 border rounded"
                                    />
                                    <button
                                        onClick={handleAddLogo}
                                        className="bg-mainColor text-white px-4 py-2 rounded  flex items-center space-x-2"
                                    >
                                        <PlusCircle className="h-5 w-5" />
                                        <span>Logo Ekle</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-neutral-50 rounded border   overflow-hidden p-4">
                                    <img
                                        src={
                                            logos[0].logoUrl.startsWith('http')
                                                ? logos[0].logoUrl
                                                : `https://via.placeholder.com/300x150.png?text=Logo`
                                        }
                                        alt="Logo"
                                        className="w-full h-32 object-contain"
                                    />
                                    <div className="mt-6 flex  flex-col space-y-5 justify-between items-center">
                                        {editingLogo && editingLogo.id === logos[0].id ? (
                                            <>
                                                <input
                                                    type="file"
                                                    accept=".png, .jpeg, .jpg"
                                                    onChange={handleEditingLogoFileChange}
                                                    className="p-2 border rounded"
                                                />
                                                <div className='flex space-x-4 items-center justify-center'>

                                                    <button
                                                        onClick={() => setEditingLogo(null)}
                                                        className="text-mainColor hover:text-gray-800 border px-4 py-2 border-mainColor rounded"
                                                    >
                                                        Vazgeç
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateLogo(logos[0].id)}
                                                        className="bg-mainColor text-neutral-100 px-4 py-2 rounded hover:shadow-2xl"
                                                    >
                                                        Kaydet
                                                    </button>
                                                </div>

                                            </>
                                        ) : (
                                            <>
                                                <div className='flex space-x-5'>
                                                    <button
                                                        onClick={() =>
                                                            setEditingLogo({
                                                                id: logos[0].id,
                                                                logoUrl: logos[0].logoUrl,
                                                                imageFile: null,
                                                            })
                                                        }
                                                        className="text-mainColor hover:shadow-2xl"
                                                    >
                                                        <Edit2 className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLogo(logos[0].id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>

                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                />
               

            </Routes>
        </div>
    );
};

export default Admin;