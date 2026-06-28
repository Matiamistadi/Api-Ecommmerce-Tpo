import { useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import FilterSidebar from '../components/FilterSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductos, selectProductos, selectProductosLoading, selectProductosError } from '../redux/features/productsSlice';
import './Catalogo.css';

const Catalogo = () => {
  const dispatch = useDispatch();
  const productos = useSelector(selectProductos);
  const loading = useSelector(selectProductosLoading);
  const error = useSelector(selectProductosError);
  const recargarProductos = () => dispatch(fetchProductos());
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('Todas');
  const [saborSeleccionado, setSaborSeleccionado] = useState('Todos');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('destacados');
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [soloConStock, setSoloConStock] = useState(false);

  const productosActivos = productos.filter((p) => p.activo !== false);

  // Listas de marcas y gustos a partir de los productos (sin repetir)
  const marcas = ['Todas', ...Array.from(new Set(productos.map((p) => p.marca).filter(Boolean)))];
  const sabores = ['Todos', ...Array.from(new Set(productos.map((p) => p.sabor).filter((s) => s && s !== 'Otro')))];

  // Filtros combinados: búsqueda + categoría + marca + gusto + rango de precio
  const productosFiltrados = productosActivos.filter((p) => {
    const okBusqueda = busqueda === '' || `${p.nombre} ${p.marca}`.toLowerCase().includes(busqueda.toLowerCase());
    const okCategoria = categoriaSeleccionada === 'Todas' || p.categoria === categoriaSeleccionada;
    const okMarca = marcaSeleccionada === 'Todas' || p.marca === marcaSeleccionada;
    const okSabor = saborSeleccionado === 'Todos' || p.sabor === saborSeleccionado;
    const okMin = precioMin === '' || p.precio >= Number(precioMin);
    const okMax = precioMax === '' || p.precio <= Number(precioMax);
    const okStock = !soloConStock || (p.stock != null && p.stock > 0);
    return okBusqueda && okCategoria && okMarca && okSabor && okMin && okMax && okStock;
  });

  // Orden elegido por el usuario
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (orden === 'precio-asc') return a.precio - b.precio;
    if (orden === 'precio-desc') return b.precio - a.precio;
    if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
    return 0;
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
    setSoloConStock(false);
  };

  return (
    <main className="catalogo">
      <header className="catalogo__header">
        <h1 className="catalogo__title">Catálogo de Suplementos</h1>
        <p className="catalogo__subtitle">
          Potencia tu rendimiento con nuestra selección premium.
        </p>

        <div className="catalogo__search">
          <Search size={18} className="catalogo__search-icon" />
          <input
            type="text"
            className="catalogo__search-input"
            placeholder="Buscar por nombre o marca..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

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
            <div className="catalogo__grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
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
              <div className="catalogo__toolbar">
                <p className="catalogo__count">
                  {productosOrdenados.length} {productosOrdenados.length === 1 ? 'producto' : 'productos'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: 'inherit' }}>
                    <input
                      type="checkbox"
                      checked={soloConStock}
                      onChange={(e) => setSoloConStock(e.target.checked)}
                    />
                    Solo con stock
                  </label>
                  <label className="catalogo__sort-label">
                    Ordenar por
                    <select
                      className="catalogo__sort"
                      value={orden}
                      onChange={(e) => setOrden(e.target.value)}
                    >
                      <option value="destacados">Destacados</option>
                      <option value="precio-asc">Precio: menor a mayor</option>
                      <option value="precio-desc">Precio: mayor a menor</option>
                      <option value="nombre">Nombre (A-Z)</option>
                    </select>
                  </label>
                </div>
              </div>

              {productosOrdenados.length === 0 ? (
                <p className="catalogo__empty">
                  No encontramos productos con esos filtros. Probá ajustar la búsqueda.
                </p>
              ) : (
                <div className="catalogo__grid">
                  {productosOrdenados.map((producto) => (
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
