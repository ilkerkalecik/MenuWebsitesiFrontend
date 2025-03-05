import React from 'react';

const ProductModal = ({ product, closeModal }: { product: any, closeModal: () => void }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
            <div className="relative bg-white w-full h-full max-w-4xl mx-auto flex flex-col p-6 md:p-10 rounded-none md:rounded-lg shadow-lg">
                
                

                {/* Ürün Görseli */}
                <div className="w-full h-2/5 md:h-3/5">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                {/* Ürün Bilgileri */}
                <div className="flex flex-col items-center text-center flex-grow justify-center space-y-4 mt-6">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <p className="text-gray-700 text-lg">{product.description}</p>
                    <span className="text-3xl font-semibold text-primaryMain">{product.price.toFixed(2)} ₺</span>
                </div>

                {/* Kapat Butonu */}
                <button
                    onClick={closeModal}
                    className="w-full mt-6 py-4 bg-secondaryMain text-white text-xl font-semibold rounded-lg shadow-md transition duration-300 hover:bg-secondaryDark"
                >
                    Kapat
                </button>
            </div>
        </div>
    );
};

export default ProductModal;
