import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { productos } from '../data/productos';
import './Catalogo.css';

const Catalogo = () => {
  // Estado local: qué categoría está seleccionada actualmente
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  // Lógica de filtrado: si es "Todas" mostramos todo, sino filtramos
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
      </header>

      <div className="catalogo__layout">
        <FilterSidebar
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaChange={setCategoriaSeleccionada}
        />

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