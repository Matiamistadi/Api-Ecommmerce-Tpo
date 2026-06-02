import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '@/lib/utils';
import './ProductCard.css';

const ProductCard = ({ producto, variant }) => {
  const { agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState(false);
  const isHome = variant === 'home';
  const discount =
    producto.precioOriginal &&
    Math.round((1 - producto.precio / producto.precioOriginal) * 100);

  const handleAgregar = (e) => {
    e.preventDefault();
    agregarAlCarrito(producto, 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  if (isHome) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-2xl bg-gym-surface',
          'shadow-[var(--shadow-card)] transition-all',
          'hover:shadow-[var(--shadow-card-hover)]'
        )}
      >
        <span
          className={cn(
            'mx-5 mt-4 inline-block rounded px-3 py-1.5 text-xs font-medium',
            'bg-gym-chip-bg text-gym-chip-text'
          )}
        >
          {producto.categoria}
        </span>

        <Link to={`/producto/${producto.id}`} className="block px-5 text-inherit no-underline">
          <div
            className={cn(
              'relative mt-3 flex aspect-4/3 items-center justify-center p-6',
              'bg-gradient-to-br from-gym-primary to-[#0d0d14]'
            )}
          >
            {discount > 0 && (
              <span className="absolute top-3 left-3 z-10 rounded bg-[#e63946] px-2.5 py-1.5 text-xs font-extrabold text-white">
                -{discount}%
              </span>
            )}
            <img
              src={producto.imagenUrl}
              alt={producto.nombre}
              className="max-h-[200px] w-auto max-w-[85%] object-contain"
            />
          </div>
          <h3 className="mt-4 mb-2 font-gym-heading text-[17px] font-bold text-gym-text">
            {producto.nombre}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 px-5 pb-4">
          <span className="font-gym-heading text-2xl font-bold text-gym-text">
            ${producto.precio.toFixed(2)}
          </span>
          {producto.precioOriginal && (
            <span className="text-sm text-gym-text-muted line-through">
              ${producto.precioOriginal.toFixed(2)}
            </span>
          )}
        </div>

        <button
          type="button"
          className={cn(
            'mx-5 mb-5 flex w-[calc(100%-2.5rem)] items-center justify-center gap-2 rounded-[var(--radius-md)] py-3.5',
            'text-sm font-semibold text-white transition-colors',
            agregado
              ? '!bg-gym-accent !text-gym-primary'
              : 'bg-gym-primary hover:bg-gym-primary-hover'
          )}
          onClick={handleAgregar}
        >
          {agregado ? (
            <>
              <Check className="size-4" aria-hidden />
              Agregado
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" aria-hidden />
              Agregar
            </>
          )}
        </button>
      </div>
    );
  }

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
