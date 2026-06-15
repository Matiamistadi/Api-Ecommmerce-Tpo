import { Star } from 'lucide-react';

// Dibuja 5 estrellas, llenas según el valor (redondeado)
const StarRating = ({ valor = 0, size = 16 }) => {
  const llenas = Math.round(valor);
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= llenas ? '#f5a623' : 'none'}
          color={i <= llenas ? '#f5a623' : '#d1d5db'}
        />
      ))}
    </span>
  );
};

export default StarRating;
