import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ producto }) => {
  return (
    <div className="product-card">
      <span className="product-card__chip">{producto.categoria}</span>

      <Link to={`/producto/${producto.id}`} className="product-card__link">
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

      <button className="product-card__button">Agregar</button>
    </div>
  );
};

export default ProductCard;
