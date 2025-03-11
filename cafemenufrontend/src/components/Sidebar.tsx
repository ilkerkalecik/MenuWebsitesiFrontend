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
    const isHomePage = location.pathname === "/" || location.pathname === "/menu";

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
                    <div className="container mx-auto  rounded-lg p-2 flex justify-between items-center ">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-full shadow-md transition-opacity duration-300 ease-in-out"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="flex space-x-4 items-center tracking-wide text-mainColor text-xs lg:text-base">
                            <a href="/" className=" transition">Ana Sayfa</a>
                            <a href="/menu" className="   transition">Menü</a>
                            <a href="https://www.kahveperest.com.tr" className=" bg-mainColor py-2 px-3 rounded text-neutral-50  transition">Online Sipariş</a>
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

            <div className={`fixed top-0 h-full w-64 bg-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                <div className="flex flex-col h-full p-5">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-5 right-5 bg-neutral-50 p-2 rounded-full shadow-md"
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

                    <nav className="flex flex-col space-y-4 mt-4 px-1 text-mainColor ">
                        <a href="/" className=" tracking-wider transition">Ana Sayfa</a>
                        <a href="/menu" className=" tracking-wider  ">Menü</a>
                        <a href="https://www.kahveperest.com.tr" className=" tracking-wider   rounded text-mainColor transition">Online  Sipariş</a>
                    </nav>


                    <div className="mt-auto text-center text-sm text-mainColor">
                        <p className='text-sm text-neutral-800  font-light tracking-wider'>
                            Online kahve alışverişi için:
                            <a href='https://www.kahveperest.com.tr' target='_blank' rel='noopener noreferrer' className='text-mainColor font-bold'> www.kahveperest.com.tr</a>
                        </p>
                      
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
