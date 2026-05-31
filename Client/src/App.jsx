import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
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
  return (
    <Routes>
      <Route element={<PublicLayout />}>
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
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
      </Route>
    </Routes>
  );
}

export default App;
