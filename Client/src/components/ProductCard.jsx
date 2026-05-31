import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ producto }) => {
  const { agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState(false);

  const handleAgregar = (e) => {
    e.preventDefault();
    agregarAlCarrito(producto, 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  return (
    <div className="product-card">
      <span className="product-card__chip">{producto.categoria}</span>

      <Link to={`/productos/${producto.id}`} className="product-card__link">
        <div className="product-card__image">
          <img src={producto.imagenUrl} alt={producto.nombre} />
        </div>
        <p className="product-card__brand">{producto.marca}</p>
        <h3 className="product-card__name">{producto.nombre}</h3>
      </Link>

      <div className="product-card__price">
        <span className="product-card__price-current">${producto.precio.toFixed(2)}</span>
        {producto.precioOriginal && (
          <span className="product-card__price-old">${producto.precioOriginal.toFixed(2)}</span>
        )}
      </div>

      <button
        className={`product-card__button ${agregado ? 'product-card__button--ok' : ''}`}
        onClick={handleAgregar}
      >
        {agregado ? '✓ Agregado' : 'Agregar'}
      </button>
    </div>
  );
};

export default ProductCard;
