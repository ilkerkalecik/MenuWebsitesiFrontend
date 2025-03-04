import { Link, useLocation } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { api } from '../api';
import { Logo } from '../types';

const Navbar = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    const [logo, setLogo] = useState<Logo | null>(null);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await api.getLogos();
                // Birden fazla logo varsa, ilkini kullanıyoruz
                if (response.data && response.data.length > 0) {
                    setLogo(response.data[0]);
                }
            } catch (error) {
                console.error('Logo yüklenirken hata oluştu', error);
            }
        };
        fetchLogo();
    }, []);

    return (
        <div>
            <div className='px-4 py-2 flex flex-row justify-between container mx-auto bg-primaryWhite'>
                <div>Bize Yazın!</div>
                <div>Takip edin</div>
            </div>
            <nav className=" bg-gradient-to-r from-primaryMain to-secondaryMain antialiased">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2 ">
                            {logo && logo.logoUrl ? (
                                <img className='w-20 rounded-full' src={logo.logoUrl} alt="Logo" />
                            ) : (
                                <span className='text-white text-xl font-bold'>Logo</span>
                            )}
                        </Link>
                        <Link
                            to={isAdmin ? '/' : '/admin'}
                            className="flex items-center space-x-1 text-white hover:text-amber-600"
                        >
                            {isAdmin ? (
                                <span>Menüyü göster</span>
                            ) : (
                                <>
                                    
                                </>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
