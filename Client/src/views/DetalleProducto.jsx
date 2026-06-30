import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectProductos, selectProductosLoading, selectProductosError } from '../redux/features/productsSlice';
import { agregarAlCarrito as agregarAlCarritoAction } from '../redux/features/cartSlice';
import { useToast } from '../context/ToastContext';
import { selectUsuario } from '../redux/features/authSlice';
import { formatPrecio } from '@/lib/formato';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import '../components/ProductCardSkeleton.css';
import './DetalleProducto.css';
import { apiFetch } from '../services/api';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mostrarToast } = useToast();
  const usuario = useSelector(selectUsuario);
  const productos = useSelector(selectProductos);
  const loading = useSelector(selectProductosLoading);
  const error = useSelector(selectProductosError);
  const producto = productos.find((p) => p.id === parseInt(id));
  const [cantidad, setCantidad] = useState(1);
  const [imgActiva, setImgActiva] = useState(0);

  // Reseñas reales
  const [resenas, setResenas] = useState([]);
  const [formResena, setFormResena] = useState({ calificacion: 5, comentario: '' });
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [errorResena, setErrorResena] = useState('');

  useEffect(() => {
    if (!id) return;
    apiFetch(`/api/productos/${id}/resenas`)
      .then(setResenas)
      .catch(() => setResenas([]));
  }, [id]);

  const promedioEstrellas = resenas.length
    ? (resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length).toFixed(1)
    : null;

  const handleEnviarResena = async (e) => {
    e.preventDefault();
    if (!usuario) { navigate('/login'); return; }
    setEnviandoResena(true);
    setErrorResena('');
    try {
      const nueva = await apiFetch(`/api/productos/${id}/resenas`, {
        method: 'POST',
        body: JSON.stringify(formResena),
      });
      setResenas(prev => [nueva, ...prev]);
      setFormResena({ calificacion: 5, comentario: '' });
      mostrarToast('¡Gracias por tu reseña!');
    } catch (err) {
      setErrorResena(err.message);
    } finally {
      setEnviandoResena(false);
    }
  };

  const yoResene = usuario && resenas.some(r => r.usuario?.id === usuario.id);

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

  // Productos de la misma categoría (sin el actual)
  const relacionados = productos
    .filter((p) => p.activo !== false && p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  const disminuir = () => setCantidad((c) => Math.max(1, c - 1));
  // No dejamos elegir más unidades que el stock disponible
  const aumentar = () => setCantidad((c) => Math.min(producto.stock, c + 1));

  const handleAgregar = () => {
    dispatch(agregarAlCarritoAction({ producto, cantidad }));
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

          {promedioEstrellas && (
            <div className="detalle__rating">
              <StarRating valor={parseFloat(promedioEstrellas)} size={16} />
              <span className="detalle__rating-text">{promedioEstrellas} · {resenas.length} opiniones</span>
            </div>
          )}

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

        {promedioEstrellas && (
          <div className="detalle__reseñas-resumen">
            <span className="detalle__reseñas-nota">{promedioEstrellas}</span>
            <div>
              <StarRating valor={parseFloat(promedioEstrellas)} size={18} />
              <p className="detalle__reseñas-cantidad">Basado en {resenas.length} opiniones</p>
            </div>
          </div>
        )}

        {/* Formulario para dejar reseña */}
        {usuario && !yoResene && (
          <form onSubmit={handleEnviarResena} style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 480 }}>
            <strong style={{ color: 'var(--gym-text, #f1f5f9)' }}>Dejá tu opinión</strong>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button"
                  onClick={() => setFormResena(f => ({ ...f, calificacion: n }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: n <= formResena.calificacion ? '#f59e0b' : '#4b5563' }}>
                  ★
                </button>
              ))}
            </div>
            <textarea
              placeholder="Contanos tu experiencia (opcional)"
              value={formResena.comentario}
              onChange={e => setFormResena(f => ({ ...f, comentario: e.target.value }))}
              maxLength={1000}
              rows={3}
              style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#f1f5f9', resize: 'vertical' }}
            />
            {errorResena && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errorResena}</span>}
            <button type="submit" disabled={enviandoResena}
              style={{ alignSelf: 'flex-start', padding: '0.5rem 1.25rem', background: 'var(--gym-accent, #10b981)', color: '#0a0a0a', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
              {enviandoResena ? 'Enviando...' : 'Publicar reseña'}
            </button>
          </form>
        )}

        <div className="detalle__reseñas-lista">
          {resenas.length === 0 && <p style={{ color: '#9ca3af' }}>Aún no hay opiniones. ¡Sé el primero!</p>}
          {resenas.map((r) => (
            <div key={r.id} className="detalle__reseña">
              <div className="detalle__reseña-header">
                <strong>{r.usuario?.nombre || r.usuario?.email || 'Usuario'}</strong>
                <StarRating valor={r.calificacion} size={14} />
              </div>
              {r.comentario && <p className="detalle__reseña-texto">{r.comentario}</p>}
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
