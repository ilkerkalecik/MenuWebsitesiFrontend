import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Menu from './pages/Menu.tsx';
import Admin from './pages/Admin.tsx';
import Navbar from './components/Navbar.tsx';
import Login from './pages/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-primaryWhite">
        <Navbar />
        <div className="container mx-auto px-2 py-8">
          <Routes>
            {/* Müşteriler için ana sayfa; auth gerekmiyor */}
            <Route path="/" element={<Menu />} />

          

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
