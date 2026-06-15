import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrecio } from '@/lib/formato';
import './Carrito.css';

const Carrito = () => {
  const { carrito, eliminarDelCarrito, actualizarCantidad, subtotal } = useCart();
  const navigate = useNavigate();

  const impuestos = subtotal * 0.08;
  const total = subtotal + impuestos;

  if (carrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <div className="carrito-vacio__icon">🛒</div>
        <h2 className="carrito-vacio__title">Tu carrito está vacío</h2>
        <p className="carrito-vacio__text">Explorá nuestro catálogo y agregá productos.</p>
        <Link to="/productos" className="carrito-vacio__btn">Ver catálogo →</Link>
      </div>
    );
  }

  return (
    <main className="carrito">
      <div className="carrito__container">
        <h1 className="carrito__title">Tu Carrito</h1>

        <div className="carrito__layout">
          <div className="carrito__items">
            {carrito.map(item => (
              <div key={item.id} className="carrito__item">
                <img src={item.imagenUrl} alt={item.nombre} className="carrito__item-img" />
                <div className="carrito__item-info">
                  <span className="carrito__item-chip">{item.categoria}</span>
                  <p className="carrito__item-nombre">{item.nombre}</p>
                  <p className="carrito__item-marca">{item.marca}</p>
                </div>
                <div className="carrito__item-controls">
                  <div className="carrito__cantidad">
                    <button
                      className="carrito__cantidad-btn"
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    >−</button>
                    <span className="carrito__cantidad-valor">{item.cantidad}</span>
                    <button
                      className="carrito__cantidad-btn"
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= (item.stock ?? Infinity)}
                    >+</button>
                  </div>
                  <p className="carrito__item-precio">
                    {formatPrecio(item.precio * item.cantidad)}
                  </p>
                  <button
                    className="carrito__item-eliminar"
                    onClick={() => eliminarDelCarrito(item.id)}
                    aria-label="Eliminar"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito__resumen">
            <h2 className="carrito__resumen-title">Resumen del Pedido</h2>
            <div className="carrito__resumen-row">
              <span>Subtotal</span><span>{formatPrecio(subtotal)}</span>
            </div>
            <div className="carrito__resumen-row">
              <span>Envío</span>
              <span className="carrito__resumen-envio">Calculado al finalizar</span>
            </div>
            <div className="carrito__resumen-row">
              <span>Impuestos (8%)</span><span>{formatPrecio(impuestos)}</span>
            </div>
            <div className="carrito__resumen-total">
              <span>Total</span><span>{formatPrecio(total)}</span>
            </div>
            <button className="carrito__checkout-btn" onClick={() => navigate('/checkout')}>
              Proceder al Pago →
            </button>
            <p className="carrito__seguro">🔒 Pago Seguro y Encriptado</p>
            <Link to="/productos" className="carrito__seguir">← Seguir comprando</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Carrito;
