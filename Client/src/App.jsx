import { Routes, Route, useLocation } from 'react-router-dom';
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
import AgregarDireccion from './views/AgregarDireccion';
import AgregarProducto from './views/AgregarProducto';
import NotFound from './views/NotFound';
import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

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
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/pago-confirmado" element={<Confirmacion />} />
          <Route path="/agregar-direccion" element={<AgregarDireccion />} />
          <Route path="/agregar-producto" element={<AgregarProducto />} />
          <Route path="/perfil" element={<MiPerfil />} />
          <Route path="/admin" element={<AdminProductos />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/pedidos" element={<AdminPedidos />} />
          <Route path="/admin/clientes" element={<AdminClientes />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
