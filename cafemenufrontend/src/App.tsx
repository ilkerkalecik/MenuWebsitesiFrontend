import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Menu from './pages/Menu.tsx';
import Admin from './pages/Admin.tsx';
import Sidebar from './components/Sidebar.tsx'; // Sidebar bileşeni
import Login from './pages/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AnaSayfa from './pages/AnaSayfa.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-secondaryWhite font-lato">
        {/* Sidebar */}
        <Sidebar />

        {/* İçerik Alanı */}
        <div className="flex-1 container mx-auto ">
          <Routes>
            {/* Müşteriler için ana sayfa; auth gerekmiyor */}
            
            <Route path="/" element={<AnaSayfa />} />

            <Route path="/menu" element={<Menu />} />

            {/* Login sayfası */}
            <Route path="/login" element={<Login />} />

            {/* Admin panelini korumak için ProtectedRoute kullanıyoruz */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/*" element={<Admin />} />
            </Route>
          </Routes>
        </div>

        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
