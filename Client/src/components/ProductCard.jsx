import './ProductCard.css';

const ProductCard = () => {
  return (
    <div className="product-card">
      <span className="product-card__chip">Proteína</span>

      <div className="product-card__image">
        <img
          src="https://placehold.co/400x400/1a1a2e/00d4aa?text=WHEY"
          alt="Whey Protein Isolate 2kg"
        />
      </div>

      <p className="product-card__brand">OPTIMUM NUTRITION</p>
      <h3 className="product-card__name">Whey Protein Isolate 2kg</h3>

      <div className="product-card__price">
        <span className="product-card__price-current">$39.99</span>
        <span className="product-card__price-old">$49.99</span>
      </div>

      <button className="product-card__button">Agregar</button>
    </div>
  );
};

export default ProductCard;