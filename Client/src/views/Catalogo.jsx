import ProductCard from '../components/ProductCard';
import { productos } from '../data/productos';
import './Catalogo.css';

const Catalogo = () => {
  return (
    <main className="catalogo">
      <header className="catalogo__header">
        <h1 className="catalogo__title">Catálogo de Suplementos</h1>
        <p className="catalogo__subtitle">
          Potencia tu rendimiento con nuestra selección premium.
        </p>
      </header>

      <section className="catalogo__grid">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </section>
    </main>
  );
};

export default Catalogo;