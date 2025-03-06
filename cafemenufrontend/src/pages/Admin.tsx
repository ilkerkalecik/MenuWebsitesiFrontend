import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Category, Product, Logo } from '../types';
import { api } from '../api';
import { PlusCircle, Edit2, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Admin = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [logos, setLogos] = useState<Logo[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingLogo, setEditingLogo] = useState<{ id: number; logoUrl: string; imageFile: File | null } | null>(null);
    const handleIngredientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ingredients = e.target.value.split(',').map((item) => item.trim());
        setNewProduct((prev) => ({ ...prev, ingredients }));
    };

    const handleEditingIngredientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ingredients = e.target.value.split(',').map((item) => item.trim());
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, ingredients });
        }
    };


    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        imageUrl: '',
        description: '',
        categoryId: 0,
        ingredients: [] as string[], // Yeni eklenen alan
        imageFile: null as File | null,
    });

    const [newLogo, setNewLogo] = useState<{ logoUrl: string; imageFile: File | null }>({
        logoUrl: '',
        imageFile: null,
    });

    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = location.pathname.includes('products')
        ? 'products'
        : location.pathname.includes('logos')
            ? 'logos'
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

    const handleUpdateProduct = async (id: number) => {
        if (!editingProduct) return;

        let imageUrl = editingProduct.imageUrl;
        if (!newProduct.imageFile && !editingProduct.imageUrl) {
            imageUrl = 'https://via.placeholder.com/500x300.png?text=Default+Image';
        }

        try {
            await api.updateProduct(id, {
                name: editingProduct.name,
                price: editingProduct.price,
                imageUrl,
                description: editingProduct.description,
                category: { id: editingProduct.category?.id ?? 0 },
                ingredients: editingProduct.ingredients, // ingredients alanını ekleyin
            });
            toast.success('Ürün başarıyla kaydedildi');
            fetchData();
            setEditingProduct(null);
        } catch (error) {
            toast.error('Ürün güncellenirken bir hata oluştu');
        }
    };
    const handleDeleteProduct = async (id: number) => {
        if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz')) return;
        try {
            await api.deleteProduct(id);
            toast.success('Ürün başarıyla silindi');
            fetchData();
        } catch (error) {
            toast.error('Ürün silinirken bir hata oluştu');
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Çıkış Yap
                </button>
            </div>

            <div className="flex space-x-4 border-b">
                <Link
                    to="/admin"
                    className={`pb-2 px-4 ${activeTab === 'categories'
                        ? 'border-b-2 border-amber-600 text-amber-600'
                        : 'text-gray-600'
                        }`}
                >
                    Kategoriler
                </Link>
                <Link
                    to="/admin/products"
                    className={`pb-2 px-4 ${activeTab === 'products'
                        ? 'border-b-2 border-amber-600 text-amber-600'
                        : 'text-gray-600'
                        }`}
                >
                    Ürünler
                </Link>
                <Link
                    to="/admin/logos"
                    className={`pb-2 px-4 ${activeTab === 'logos'
                        ? 'border-b-2 border-amber-600 text-amber-600'
                        : 'text-gray-600'
                        }`}
                >
                    Logo
                </Link>
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
                                    className="flex-1 p-2 border rounded"
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                </button>
                            </div>

                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="categories">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-4"
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
                                                            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                                                        >
                                                            <div className="flex items-center flex-1">
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="mr-3 cursor-grab"
                                                                >
                                                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                {editingCategory?.id === category.id ? (
                                                                    <input
                                                                        type="text"
                                                                        value={editingCategory.name}
                                                                        onChange={(e) =>
                                                                            setEditingCategory({ ...editingCategory, name: e.target.value })
                                                                        }
                                                                        className="flex-1 p-2 border rounded mr-4"
                                                                    />
                                                                ) : (
                                                                    <span className="text-lg">{category.name}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                {editingCategory?.id === category.id ? (
                                                                    <button
                                                                        onClick={() => handleUpdateCategory(category.id, editingCategory.name)}
                                                                        className="text-green-600 hover:text-green-700"
                                                                    >
                                                                        Kaydet
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setEditingCategory(category)}
                                                                        className="text-amber-600 hover:text-amber-700"
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
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="Ürün ismi"
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                                    }
                                    placeholder="Fiyat"
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="file"
                                    accept=".png, .jpeg, .jpg"
                                    onChange={handleFileChange}
                                    className="p-2 border rounded bg-white"
                                />
                                <select
                                    value={newProduct.categoryId}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, categoryId: parseInt(e.target.value) })
                                    }
                                    className="p-2 border rounded"
                                >
                                    <option value={0}>Kategori seç</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="Ürün açıklaması"
                                    className="p-2 border rounded col-span-2"
                                />
                                <textarea
                                    value={newProduct.ingredients.join(', ')} // Ingredients dizisini virgüllerle ayarlıyoruz
                                    onChange={(e) => {
                                        const ingredients = e.target.value.split(',').map(ingredient => ingredient.trim()); // Virgülleri ayırıp diziye çeviriyoruz
                                        setNewProduct({ ...newProduct, ingredients });
                                    }}
                                    placeholder="İçindekiler (Virgülle ayırın)"
                                    className="p-2 border rounded col-span-2"
                                />
                                <button
                                    onClick={handleAddProduct}
                                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 col-span-2"
                                >
                                    Ürünü ekle
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <img
                                            src={product.imageUrl.startsWith('http')
                                                ? product.imageUrl
                                                : `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop`}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            {editingProduct?.id === product.id ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={editingProduct.name}
                                                        onChange={(e) =>
                                                            setEditingProduct({ ...editingProduct, name: e.target.value })
                                                        }
                                                        className="w-full p-2 border rounded"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={editingProduct.price}
                                                        onChange={(e) =>
                                                            setEditingProduct({
                                                                ...editingProduct,
                                                                price: parseFloat(e.target.value),
                                                            })
                                                        }
                                                        className="w-full p-2 border rounded"
                                                    />
                                                    <textarea
                                                        value={editingProduct.description}
                                                        onChange={(e) =>
                                                            setEditingProduct({
                                                                ...editingProduct,
                                                                description: e.target.value,
                                                            })
                                                        }
                                                        className="w-full p-2 border rounded"
                                                    />
                                                    <textarea
                                                        value={editingProduct.ingredients.join(', ')} // ingredients'ı virgüllerle ayarlıyoruz
                                                        onChange={(e) => {
                                                            const ingredients = e.target.value.split(',').map(ingredient => ingredient.trim());
                                                            setEditingProduct({ ...editingProduct, ingredients });
                                                        }}
                                                        placeholder="İçindekiler (Virgülle ayırın)"
                                                        className="w-full p-2 border rounded"
                                                    />
                                                    <button
                                                        onClick={() => handleUpdateProduct(product.id)}
                                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                                    >
                                                        Kaydet
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                                    <p className="text-gray-600 mt-1">{product.description}</p>
                                                    <div className="mt-4">
                                                        <h4 className="text-sm font-semibold">İçindekiler:</h4>
                                                        <ul className="text-sm text-gray-600">
                                                            {product.ingredients?.map((ingredient, index) => (
                                                                <li key={index}>{ingredient}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="mt-4 flex justify-between items-center">
                                                        <span className="text-amber-600 font-bold">
                                                            ₺{product.price.toFixed(2)}
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => setEditingProduct(product)}
                                                                className="text-amber-600 hover:text-amber-700"
                                                            >
                                                                <Edit2 className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product.id)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                        className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 flex items-center space-x-2"
                                    >
                                        <PlusCircle className="h-5 w-5" />
                                        <span>Logo Ekle</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
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
                                                <button
                                                    onClick={() => handleUpdateLogo(logos[0].id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                                >
                                                    Kaydet
                                                </button>
                                                <button
                                                    onClick={() => setEditingLogo(null)}
                                                    className="text-gray-600 hover:text-gray-800"
                                                >
                                                    Vazgeç
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setEditingLogo({
                                                            id: logos[0].id,
                                                            logoUrl: logos[0].logoUrl,
                                                            imageFile: null,
                                                        })
                                                    }
                                                    className="text-amber-600 hover:text-amber-700"
                                                >
                                                    <Edit2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLogo(logos[0].id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
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