import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';
import { Category, Logo } from '../types';

const Navbar = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [logo, setLogo] = useState<Logo | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

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

    return (
        <div>
            {/* Navbar */}
            <div className='container flex mx-auto px-4 py-4  bg-secondaryWhite border-b border-neutral-200'>
                {logo && logo.logoUrl ? (
                    <img className='w-10 rounded-full' src={logo.logoUrl} alt="Logo" />
                ) : (
                    <span className='text-secondaryBlack text-xl font-bold'>Logo</span>
                )}
            </div>

           
        </div>
    );
};

export default Navbar;
