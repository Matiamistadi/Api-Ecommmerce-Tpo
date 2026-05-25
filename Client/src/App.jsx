import { Routes, Route } from 'react-router-dom';
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
import Admin from './views/Admin';
import NotFound from './views/NotFound';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app__content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/suplementos" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/perfil" element={<MiPerfil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
