import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import './DetalleProducto.css';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const { productos } = useProducts();
  const producto = productos.find((p) => p.id === parseInt(id));
  const [cantidad, setCantidad] = useState(1);
  const [imgActiva, setImgActiva] = useState(0);

  if (!producto) {
    return (
      <div className="placeholder">
        <h1 className="placeholder__title">Producto no encontrado</h1>
        <p className="placeholder__text">El producto que buscás no existe.</p>
        <Link to="/productos" className="home__cta">Ver catálogo</Link>
      </div>
    );
  }

  const imagenes = [producto.imagenUrl, producto.imagenDetalleUrl].filter(Boolean);

  const disminuir = () => setCantidad((c) => Math.max(1, c - 1));
  const aumentar = () => setCantidad((c) => c + 1);

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
            <span className="detalle__precio">${producto.precio.toFixed(2)}</span>
            <span className="detalle__stock">✓ En Stock</span>
          </div>

          <div className="detalle__cantidad">
            <label className="detalle__label">Cantidad</label>
            <div className="detalle__cantidad-control">
              <button onClick={disminuir} className="detalle__cantidad-btn">−</button>
              <span className="detalle__cantidad-valor">{cantidad}</span>
              <button onClick={aumentar} className="detalle__cantidad-btn">+</button>
            </div>
          </div>

          <button
            className="detalle__agregar"
            onClick={() => { agregarAlCarrito(producto, cantidad); navigate('/carrito'); }}
          >
            🛒 AGREGAR AL CARRITO ({cantidad})
          </button>
        </div>
      </div>
    </main>
  );
};

export default DetalleProducto;
