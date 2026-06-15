import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { useProducts } from '../context/ProductsContext';
import './Catalogo.css';

const Catalogo = () => {
  const { productos, loading, error, recargarProductos } = useProducts();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('Todas');
  const [saborSeleccionado, setSaborSeleccionado] = useState('Todos');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const productosActivos = productos.filter((p) => p.activo !== false);

  // Listas de marcas y gustos a partir de los productos (sin repetir)
  const marcas = ['Todas', ...Array.from(new Set(productos.map((p) => p.marca).filter(Boolean)))];
  const sabores = ['Todos', ...Array.from(new Set(productos.map((p) => p.sabor).filter((s) => s && s !== 'Otro')))];

  // Aplicamos todos los filtros juntos: categoría + marca + gusto + rango de precio
  const productosFiltrados = productosActivos.filter((p) => {
    const okCategoria = categoriaSeleccionada === 'Todas' || p.categoria === categoriaSeleccionada;
    const okMarca = marcaSeleccionada === 'Todas' || p.marca === marcaSeleccionada;
    const okSabor = saborSeleccionado === 'Todos' || p.sabor === saborSeleccionado;
    const okMin = precioMin === '' || p.precio >= Number(precioMin);
    const okMax = precioMax === '' || p.precio <= Number(precioMax);
    return okCategoria && okMarca && okSabor && okMin && okMax;
  });

  const aplicarRangoPrecio = (min, max) => {
    setPrecioMin(min);
    setPrecioMax(max);
  };

  const limpiarFiltros = () => {
    setCategoriaSeleccionada('Todas');
    setMarcaSeleccionada('Todas');
    setSaborSeleccionado('Todos');
    setPrecioMin('');
    setPrecioMax('');
  };

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
            marcas={marcas}
            marcaSeleccionada={marcaSeleccionada}
            onMarcaChange={setMarcaSeleccionada}
            sabores={sabores}
            saborSeleccionado={saborSeleccionado}
            onSaborChange={setSaborSeleccionado}
            precioMin={precioMin}
            precioMax={precioMax}
            onPrecioChange={aplicarRangoPrecio}
            onLimpiar={limpiarFiltros}
            onClose={() => setFiltrosAbiertos(false)}
          />
        </div>

        <section className="catalogo__content">
          {loading && (
            <p className="catalogo__count">Cargando productos...</p>
          )}

          {!loading && error && (
            <div className="catalogo__empty">
              <p>No se pudo conectar con el servidor. Verificá que el backend esté corriendo.</p>
              <button type="button" className="catalogo__filtros-toggle" onClick={recargarProductos}>
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
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
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Catalogo;
