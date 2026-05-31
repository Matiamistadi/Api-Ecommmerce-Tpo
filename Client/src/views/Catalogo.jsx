import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { useProducts } from '../context/ProductsContext';
import './Catalogo.css';

const Catalogo = () => {
  const { productos } = useProducts();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const productosFiltrados =
    categoriaSeleccionada === 'Todas'
      ? productos
      : productos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <main className="catalogo">
      <header className="catalogo__header">
        <h1 className="catalogo__title">Catálogo de Suplementos</h1>
        <p className="catalogo__subtitle">
          Potencia tu rendimiento con nuestra selección premium.
        </p>
        <button
          type="button"
          className="catalogo__filtros-toggle"
          onClick={() => setFiltrosAbiertos((current) => !current)}
        >
          {filtrosAbiertos ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </header>

      <div className="catalogo__layout">
        <div className={`catalogo__filters-shell ${filtrosAbiertos ? 'catalogo__filters-shell--open' : ''}`}>
          <FilterSidebar
            categoriaSeleccionada={categoriaSeleccionada}
            onCategoriaChange={setCategoriaSeleccionada}
            onClose={() => setFiltrosAbiertos(false)}
          />
        </div>

        <section className="catalogo__content">
          <p className="catalogo__count">
            Mostrando {productosFiltrados.length} productos
          </p>

          {productosFiltrados.length === 0 ? (
            <p className="catalogo__empty">
              No hay productos en esta categoría.
            </p>
          ) : (
            <div className="catalogo__grid">
              {productosFiltrados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Catalogo;
