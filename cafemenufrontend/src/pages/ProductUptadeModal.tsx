import { useState, ChangeEvent, FormEvent } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Product, CreateProductDto } from '../types'; // types dosyanızın yolunu doğru şekilde ayarlayın

interface ProductUpdateModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (updatedProduct: CreateProductDto) => void;
}

const ProductUpdateModal = ({ product, onClose, onUpdate }: ProductUpdateModalProps) => {
  const [updatedProduct, setUpdatedProduct] = useState<CreateProductDto>({
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    description: product.description,
    ingredients: product.ingredients,
    category: {
      id: product.category?.id || 0,
    },
  });

  // Fotoğraf için ek state (önizleme ve dosya)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(product.imageUrl);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const ingredients = e.target.value.split(',').map((ingredient) => ingredient.trim());
    setUpdatedProduct((prev) => ({
      ...prev,
      ingredients,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      // Güncelleme sırasında görseli önizle
      setPreviewImage(URL.createObjectURL(file));
      // Gerçek senaryoda, dosyayı sunucuya yükledikten sonra gelen URL ile updatedProduct.imageUrl güncellenebilir.
      setUpdatedProduct((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // onUpdate çağrısı öncesinde dosya yükleme işlemini ekleyebilirsiniz.
    onUpdate(updatedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-8 bg-opacity-80 flex justify-center items-center flex-col z-50 transition-opacity duration-500 opacity-100 scale-100 animate-open">
      <div className="relative bg-neutral-50 w-full h-full max-w-lg mx-auto flex flex-col space-y-4 p-10 rounded-none md:rounded-lg shadow-lg">
        {/* Back Arrow Button */}
        <button onClick={onClose} className="text-neutral-700 text-xl m-2">
          <FaArrowLeft />
        </button>

        {/* Modal Başlık */}
        <h2 className="text-3xl font-semibold tracking-wide text-neutral-700 mt-4">Ürün Güncelle</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Ürün İsmi */}
          <input
            type="text"
            name="name"
            value={updatedProduct.name}
            onChange={handleChange}
            placeholder="Ürün İsmi"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />

          {/* Ürün Fiyatı */}
          <input
            type="number"
            name="price"
            value={updatedProduct.price}
            onChange={handleChange}
            placeholder="Fiyat"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />

          {/* Ürün Açıklaması */}
          <textarea
            name="description"
            value={updatedProduct.description}
            onChange={handleChange}
            placeholder="Açıklama"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />

          {/* Ürün İçindekiler */}
          <textarea
            name="ingredients"
            value={updatedProduct.ingredients.join(', ')}
            onChange={handleIngredientsChange}
            placeholder="İçindekiler (Virgülle ayırın)"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />

          {/* Fotoğraf Güncelleme */}
          <div className="flex flex-col items-center">
            <label className="text-neutral-700 font-semibold mb-2">Ürün Fotoğrafı</label>
            <div className="w-full flex flex-col items-center">
              <img
                src={previewImage}
                alt={updatedProduct.name}
                className="h-64 w-full object-cover border border-neutral-200 rounded-md mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdateModal;
