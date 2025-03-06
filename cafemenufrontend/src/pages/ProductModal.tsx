import { FaArrowLeft } from 'react-icons/fa';
import React from 'react';

const ProductModal = ({ product, closeModal }: { product: any, closeModal: () => void }) => {
    const [showFullDescription, setShowFullDescription] = React.useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <div className="fixed inset-10 bg-opacity-80 flex justify-center items-center flex-col z-50 transition-opacity duration-500 opacity-0 scale-90 animate-open">
            <div className="relative bg-neutral-50 w-full h-full max-w-lg mx-auto flex space-y-6 p-4 flex-col md:p-10 rounded-none md:rounded-lg shadow-lg">

                {/* Back Arrow Button */}
                <button
                    onClick={closeModal}
                    className=" text-neutral-700 text-xl m-2"
                >
                    <FaArrowLeft />
                </button>

                {/* Product Name */}
                <h1 className="text-xl font-light tracking-wide text-neutral-800 mt-16">{product.name}</h1>

                {/* Product Image */}
                <div className="w-full mb-6">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover "
                    />
                </div>



                {/* Product Description */}
                <h2 className="text-xl font-semibold text-neutral-700 mb-2">Ürün Açıklaması</h2>
                <div className="">
                    <p className="text-neutral-500 font-extralight tracking-wider text-sm">
                        {showFullDescription
                            ? product.description
                            : `${product.description.slice(0, 150)}${product.description.length > 150 ? '...' : ''}`}
                             {/* Show More/Less Button */}
                    {product.description.length > 150 && (
                        <button
                            onClick={toggleDescription}
                            className="text-neutral-900 text-sm font-semibold underline"
                        >
                            {showFullDescription ? "Daha az " : "Daha Fazla"}
                        </button>
                    )}
                    </p>
                   

                </div>
                {/* Product Price */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-semibold text-neutral-700">{product.price.toFixed(2)} ₺</span>
                    
                </div>

            </div>
        </div>
    );
};

export default ProductModal;