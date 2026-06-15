import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrecio } from '@/lib/formato';
import { getRating } from '@/lib/rating';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import '../components/ProductCardSkeleton.css';
import './DetalleProducto.css';

// Reseñas de ejemplo (visuales por ahora)
const RESENAS = [
  { nombre: 'Martín G.', estrellas: 5, texto: 'Excelente calidad, se disuelve perfecto y el sabor es muy bueno. Lo recomiendo.' },
  { nombre: 'Lucía P.', estrellas: 4, texto: 'Muy bueno, llegó rápido. Repito seguro.' },
  { nombre: 'Diego R.', estrellas: 5, texto: 'Relación precio-calidad inmejorable. Ya es mi marca de confianza.' },
];

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const { mostrarToast } = useToast();
  const { productos, loading, error } = useProducts();
  const producto = productos.find((p) => p.id === parseInt(id));
  const [cantidad, setCantidad] = useState(1);
  const [imgActiva, setImgActiva] = useState(0);

  if (loading) {
    return (
      <main className="detalle">
        <div className="detalle__layout">
          <div className="skeleton" style={{ aspectRatio: '1 / 1', borderRadius: 16 }} />
          <div>
            <div className="skeleton" style={{ height: 22, width: '30%', marginBottom: 18 }} />
            <div className="skeleton" style={{ height: 38, width: '75%', marginBottom: 18 }} />
            <div className="skeleton" style={{ height: 15, width: '100%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 15, width: '90%', marginBottom: 28 }} />
            <div className="skeleton" style={{ height: 50, width: '60%', marginBottom: 18 }} />
            <div className="skeleton" style={{ height: 52, width: '100%' }} />
          </div>
        </div>
      </main>
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
  const rating = getRating(producto.id);

  // Productos de la misma categoría (sin el actual)
  const relacionados = productos
    .filter((p) => p.activo !== false && p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  const disminuir = () => setCantidad((c) => Math.max(1, c - 1));
  // No dejamos elegir más unidades que el stock disponible
  const aumentar = () => setCantidad((c) => Math.min(producto.stock, c + 1));

  const handleAgregar = () => {
    agregarAlCarrito(producto, cantidad);
    mostrarToast(`${cantidad} × ${producto.nombre} agregado al carrito`);
    navigate('/carrito');
  };

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

          <div className="detalle__rating">
            <StarRating valor={rating.estrellas} size={16} />
            <span className="detalle__rating-text">{rating.estrellas} · {rating.opiniones} opiniones</span>
          </div>

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
            onClick={handleAgregar}
            disabled={sinStock}
          >
            {sinStock ? 'SIN STOCK' : `🛒 AGREGAR AL CARRITO (${cantidad})`}
          </button>
        </div>
      </div>

      {/* Opiniones */}
      <section className="detalle__reseñas">
        <h2 className="detalle__seccion-titulo">Opiniones</h2>
        <div className="detalle__reseñas-resumen">
          <span className="detalle__reseñas-nota">{rating.estrellas}</span>
          <div>
            <StarRating valor={rating.estrellas} size={18} />
            <p className="detalle__reseñas-cantidad">Basado en {rating.opiniones} opiniones</p>
          </div>
        </div>
        <div className="detalle__reseñas-lista">
          {RESENAS.map((r, i) => (
            <div key={i} className="detalle__reseña">
              <div className="detalle__reseña-header">
                <strong>{r.nombre}</strong>
                <StarRating valor={r.estrellas} size={14} />
              </div>
              <p className="detalle__reseña-texto">{r.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="detalle__relacionados">
          <h2 className="detalle__seccion-titulo">También te puede interesar</h2>
          <div className="detalle__relacionados-grid">
            {relacionados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default DetalleProducto;
