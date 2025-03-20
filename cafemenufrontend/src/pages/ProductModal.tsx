import { FaArrowLeft } from 'react-icons/fa';
import React from 'react';

const ProductModal = ({ product, closeModal }: { product: any, closeModal: () => void }) => {
    const [showFullDescription, setShowFullDescription] = React.useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    // Ingredients filter to exclude empty strings
    const filteredIngredients = product.ingredients.filter((ingredient: string) => ingredient.trim() !== "");

    return (
        <div className="fixed inset-3 bg-opacity-80 flex justify-center items-center flex-col z-50 transition-opacity duration-500 opacity-0 scale-90 animate-open">
            <div className="relative bg-neutral-50 w-full h-full max-w-lg mx-auto flex space-y-6 p-4 flex-col md:p-10 rounded-none md:rounded-lg shadow-lg">

                {/* Back Arrow Button */}
                <button
                    onClick={closeModal}
                    className=" text-black text-lg m-2"
                >
                    <FaArrowLeft />
                </button>

                {/* Product Name */}
                <h1 className="text-2xl font-semibold  tracking-wide text-neutral-700 mt-16">{product.name}</h1>

                {/* Product Image */}
                <div className="w-full flex items-center justify-center ">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className=" max-h-72 border border-neutral-200 rounded-md"
                    />
                </div>

                {/* Product Description */}
                <h2 className="text-lg font-semibold tracking-wide text-neutral-700">Ürün Açıklaması</h2>
                <div className="">
                    <p className="text-neutral-600 font-light text-sm">
                        {showFullDescription
                            ? product.description
                            : `${product.description.slice(0, 150)}${product.description.length > 150 ? '...' : ''}`}
                        {/* Show More/Less Button */}
                        {product.description.length > 150 && (
                            <button
                                onClick={toggleDescription}
                                className="text-mainColor text-sm font-semibold underline"
                            >
                                {showFullDescription ? "Daha az " : "Daha Fazla"}
                            </button>
                        )}
                    </p>

                    {/* Product Ingredients */}
                    {filteredIngredients.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold tracking-wide text-neutral-700">İçindekiler</h3>
                            <ul className="grid grid-cols-3 gap-3 text-sm text-neutral-600">
                                {filteredIngredients.map((ingredient: string, index: number) => (
                                    <li className='border p-3 capitalize rounded-lg border-neutral-400 mt-4 font-bold text-mainColor text-xs text-center' key={index}>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Product Price */}
                <div className="flex items-center justify-between ">
                    <span className="text-3xl font-semibold text-mainColor">{product.price.toFixed(2)} ₺</span>
                </div>

            </div>
        </div>
    );
};

export default ProductModal;
