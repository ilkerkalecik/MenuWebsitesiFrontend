//components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    // Eğer token yoksa login sayfasına yönlendir
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
