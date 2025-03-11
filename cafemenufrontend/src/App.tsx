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
      <Routes>
        {/* AnaSayfa'yı container dışında render et */}
        <Route path="/" element={<AnaSayfa />} />
      </Routes>

      {/* Diğer sayfalar container içinde kalır */}
      <div className="flex-1 container mx-auto">
        <Routes>
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
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
