import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Catalogo from './views/Catalogo';
import DetalleProducto from './views/DetalleProducto';
import Login from './views/Login';
import Registro from './views/Registro';
import Carrito from './views/Carrito';
import Checkout from './views/Checkout';
import Confirmacion from './views/Confirmacion';
import MiPerfil from './views/MiPerfil';
import AdminProductos from './views/Admin';
import AdminDashboard from './views/AdminDashboard';
import AdminPedidos from './views/AdminPedidos';
import AdminClientes from './views/AdminClientes';
import AdminAnaliticas from './views/AdminAnaliticas';
import AdminAjustes from './views/AdminAjustes';
import AgregarDireccion from './views/AgregarDireccion';
import AgregarProducto from './views/AgregarProducto';
import SobreNosotros from './views/SobreNosotros';
import Contacto from './views/Contacto';
import FAQ from './views/FAQ';
import Envios from './views/Envios';
import OlvidePassword from './views/OlvidePassword';
import ResetPassword from './views/ResetPassword';
import NotFound from './views/NotFound';
import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app">
      {!isAdminRoute && <Header />}
      <div className={isAdminRoute ? "h-screen bg-[#fafafa] w-full" : "app__content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalogo />} />
          <Route path="/suplementos" element={<Catalogo />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/olvide-password" element={<OlvidePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/pago-confirmado" element={<Confirmacion />} />
          <Route path="/agregar-direccion" element={<AgregarDireccion />} />
          <Route path="/agregar-producto" element={<AgregarProducto />} />
          <Route path="/perfil" element={<MiPerfil />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/envios" element={<Envios />} />
          <Route path="/admin" element={<AdminProductos />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/pedidos" element={<AdminPedidos />} />
          <Route path="/admin/clientes" element={<AdminClientes />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analiticas" element={<AdminAnaliticas />} />
          <Route path="/admin/ajustes" element={<AdminAjustes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
