import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { formatPrecio } from '@/lib/formato';
import './DetalleProducto.css';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const { productos, loading, error } = useProducts();
  const producto = productos.find((p) => p.id === parseInt(id));
  const [cantidad, setCantidad] = useState(1);
  const [imgActiva, setImgActiva] = useState(0);

  if (loading) {
    return (
      <div className="placeholder">
        <h1 className="placeholder__title">Cargando producto...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="placeholder">
        <h1 className="placeholder__title">Error de conexión</h1>
        <p className="placeholder__text">No se pudo conectar con el servidor. Verificá que el backend esté corriendo.</p>
        <Link to="/productos" className="home__cta">Ver catálogo</Link>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="placeholder">
        <h1 className="placeholder__title">Producto no encontrado</h1>
        <p className="placeholder__text">El producto que buscás no existe.</p>
        <Link to="/productos" className="home__cta">Ver catálogo</Link>
      </div>
    );
  }

  const imagenes = (
    Array.isArray(producto.imagenes) && producto.imagenes.length > 0
      ? producto.imagenes
      : [producto.imagenUrl, producto.imagenDetalleUrl].filter(Boolean)
  );

  const sinStock = producto.stock <= 0;
  const discount =
    producto.precioOriginal &&
    Math.round((1 - producto.precio / producto.precioOriginal) * 100);

  const disminuir = () => setCantidad((c) => Math.max(1, c - 1));
  // No dejamos elegir más unidades que el stock disponible
  const aumentar = () => setCantidad((c) => Math.min(producto.stock, c + 1));

  return (
    <main className="detalle">
      <div className="detalle__layout">
        <div className="detalle__galeria">
          <div className="detalle__imagen">
            <img src={imagenes[imgActiva]} alt={producto.nombre} />
          </div>
          {imagenes.length > 1 && (
            <div className="detalle__thumbnails">
              {imagenes.map((src, i) => (
                <button
                  key={i}
                  className={`detalle__thumb ${i === imgActiva ? 'detalle__thumb--activa' : ''}`}
                  onClick={() => setImgActiva(i)}
                >
                  <img src={src} alt={`Vista ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detalle__info">
          <span className="detalle__chip">{producto.categoria}</span>
          <h1 className="detalle__nombre">{producto.nombre}</h1>
          <p className="detalle__descripcion">{producto.descripcion}</p>

          <div className="detalle__precio-row">
            <span className="detalle__precio">{formatPrecio(producto.precio)}</span>
            {producto.precioOriginal && (
              <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                {formatPrecio(producto.precioOriginal)}
              </span>
            )}
            {discount > 0 && (
              <span style={{ background: '#e63946', color: '#fff', fontWeight: 800, fontSize: '0.8rem', padding: '2px 8px', borderRadius: '6px' }}>
                -{discount}%
              </span>
            )}
            <span className="detalle__stock">
              {sinStock
                ? '✕ Sin stock'
                : producto.stock <= 5
                  ? '⚠ ¡Últimas unidades!'
                  : '✓ Hay stock'}
            </span>
          </div>

          <div className="detalle__cantidad">
            <label className="detalle__label">Cantidad</label>
            <div className="detalle__cantidad-control">
              <button onClick={disminuir} className="detalle__cantidad-btn">−</button>
              <span className="detalle__cantidad-valor">{cantidad}</span>
              <button onClick={aumentar} className="detalle__cantidad-btn" disabled={cantidad >= producto.stock}>+</button>
            </div>
          </div>

          <button
            className="detalle__agregar"
            onClick={() => { agregarAlCarrito(producto, cantidad); navigate('/carrito'); }}
            disabled={sinStock}
          >
            {sinStock ? 'SIN STOCK' : `🛒 AGREGAR AL CARRITO (${cantidad})`}
          </button>
        </div>
      </div>
    </main>
  );
};

export default DetalleProducto;
