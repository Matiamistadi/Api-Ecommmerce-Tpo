import './ProductCardSkeleton.css';

// Tarjeta "fantasma" que se muestra mientras cargan los productos
const ProductCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-card__image" />
    <div className="skeleton skeleton-card__line skeleton-card__line--short" />
    <div className="skeleton skeleton-card__line" />
    <div className="skeleton skeleton-card__button" />
  </div>
);

export default ProductCardSkeleton;
