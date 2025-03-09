import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';
import { Logo } from '../types';
import { Menu, X } from 'lucide-react';

const Sidebar = () => {
    const [logo, setLogo] = useState<Logo | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const location = useLocation();
    const isHomePage = location.pathname === "/";

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

    useEffect(() => {
        if (!isHomePage) {
            const handleScroll = () => {
                const scrollY = window.scrollY;
                const newOpacity = Math.max(1 - scrollY / 300, 0);
                setOpacity(newOpacity);
            };
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [isHomePage]);

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {isHomePage ? (
                <nav className="fixed top-0 p-1 border-b border-neutral-300 left-0 right-0 z-50 bg-white">
                    <div className="container mx-auto  rounded-lg p-2 flex justify-between items-center">
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="p-2 rounded-full shadow-md transition-opacity duration-300 ease-in-out"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="flex space-x-4 tracking-wide">
                            <a href="/" className="text-sm font-extralight text-neutral-700 hover:text-primaryMain transition">Ana Sayfa</a>
                            <a href="/menu" className="text-sm font-extralight text-neutral-700 hover:text-primaryMain transition">Menü</a>
                            <a href="/contact" className="text-sm font-extralight text-neutral-700 hover:text-primaryMain transition">Bize Yazın</a>
                        </div>
                    </div>
                </nav>
            ) : (
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="fixed top-5 left-5 z-50 p-2 rounded-full shadow-md transition-opacity duration-300 ease-in-out"
                    style={{ opacity }}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            <div className={`fixed top-0 h-full w-64 bg-secondaryWhite shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                <div className="flex flex-col h-full p-5">
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="absolute top-5 right-5 bg-gray-100 p-2 rounded-full shadow-md"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex items-center justify-center mb-6 mt-10">
                        {logo && logo.logoUrl ? (
                            <img className="w-20 h-20 rounded-full" src={logo.logoUrl} alt="Logo" />
                        ) : (
                            <span className="text-secondaryBlack text-2xl font-bold">Logo</span>
                        )}
                    </div>

                    <nav className="flex flex-col space-y-6">
                        <a href="/" className="text-lg font-extralight tracking-wider text-neutral-700 hover:text-primaryMain transition">Ana Sayfa</a>
                        <a href="/menu" className="text-lg font-extralight tracking-wider text-neutral-700 hover:text-primaryMain transition">Menü</a>
                        <a href="/contact" className="text-lg font-extralight tracking-wider text-neutral-700 hover:text-primaryMain transition">Bize Yazın</a>
                    </nav>

                    <div className="mt-auto text-center text-sm text-gray-500">
                        &copy; İlker Kalecik 2025 Tüm Hakları Saklıdır
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
