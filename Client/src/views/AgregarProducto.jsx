import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { getCategorias, getMarcas } from '../services/catalogoService';
import './AgregarProducto.css';

const initialForm = {
  nombre: '',
  marcaId: '',
  categoriaId: '',
  precio: '',
  precioOriginal: '',
  stock: '',
  imagenUrl: '/img/BannerNexa.png',
  imagenDetalleUrl: '/img/BannerNexa.png',
  descripcion: '',
  activo: true,
};

const AgregarProducto = () => {
  const navigate = useNavigate();
  const { agregarProducto } = useProducts();
  const [form, setForm] = useState(initialForm);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Al montar, traemos las categorías y marcas reales del backend para los <select>
  useEffect(() => {
    getCategorias().then(setCategorias).catch((err) => setError(err.message));
    getMarcas().then(setMarcas).catch((err) => setError(err.message));
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const guardar = async () => {
    if (!form.nombre || !form.precio || !form.stock) {
      setError('Completá nombre, precio y stock.');
      return;
    }

    setGuardando(true);
    setError(null);
    try {
      const nuevoProducto = await agregarProducto({
        ...form,
        descripcion: form.descripcion || `${form.nombre}`,
      });
      navigate(`/productos/${nuevoProducto.id}`);
    } catch (err) {
      // Si no sos admin (403) o el backend falla, mostramos el error sin romper la app
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="agregar-producto">
      <section className="agregar-producto__shell">
        <header className="agregar-producto__header">
          <div>
            <p className="agregar-producto__eyebrow">Administración</p>
            <h1 className="agregar-producto__titulo">Agregar producto</h1>
            <p className="agregar-producto__texto">
              Cargá un nuevo producto para que aparezca en el panel, el catálogo y el detalle sin recargar la app.
            </p>
          </div>
          <Link to="/admin/productos" className="agregar-producto__back">Volver al panel</Link>
        </header>

        <section className="agregar-producto__content">
          <form className="agregar-producto__form" onSubmit={(event) => event.preventDefault()}>
            <div className="agregar-producto__grid">
              <label className="agregar-producto__field">
                <span>Nombre del producto</span>
                <input name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="Creatina Monohidratada" />
              </label>
              <label className="agregar-producto__field">
                <span>Marca</span>
                <select name="marcaId" value={form.marcaId} onChange={handleChange}>
                  <option value="">Sin marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                  ))}
                </select>
              </label>
              <label className="agregar-producto__field">
                <span>Categoría</span>
                <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
                  <option value="">Sin categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                  ))}
                </select>
              </label>
              <label className="agregar-producto__field">
                <span>Precio</span>
                <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} placeholder="24.99" />
              </label>
              <label className="agregar-producto__field">
                <span>Stock</span>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="35" />
              </label>
              <label className="agregar-producto__field">
                <span>Precio original (opcional)</span>
                <input name="precioOriginal" type="number" step="0.01" value={form.precioOriginal} onChange={handleChange} placeholder="29.99" />
              </label>
              <label className="agregar-producto__field">
                <span>URL de imagen</span>
                <input name="imagenUrl" type="text" value={form.imagenUrl} onChange={handleChange} placeholder="/img/BannerNexa.png" />
              </label>
              <label className="agregar-producto__field">
                <span>Imagen detalle</span>
                <input name="imagenDetalleUrl" type="text" value={form.imagenDetalleUrl} onChange={handleChange} placeholder="/img/BannerNexa.png" />
              </label>
              <label className="agregar-producto__field agregar-producto__field--full">
                <span>Descripción</span>
                <textarea name="descripcion" rows="5" value={form.descripcion} onChange={handleChange} placeholder="Describí el producto, sus beneficios y recomendaciones de uso." />
              </label>
            </div>

            <div className="agregar-producto__toggles">
              <label className="agregar-producto__toggle">
                <input name="activo" type="checkbox" checked={form.activo} onChange={handleChange} />
                <span>Producto activo</span>
              </label>
            </div>

            {error && <p className="agregar-producto__error" style={{ color: '#dc2626' }}>{error}</p>}

            <div className="agregar-producto__actions">
              <Link to="/admin/productos" className="agregar-producto__btn agregar-producto__btn--secondary">Cancelar</Link>
              <button type="button" className="agregar-producto__btn agregar-producto__btn--primary" onClick={guardar} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar producto'}
              </button>
            </div>
          </form>

          <aside className="agregar-producto__aside">
            <div className="agregar-producto__preview">
              <span className="agregar-producto__preview-chip">Vista previa</span>
              <div className="agregar-producto__preview-visual">
                <div className="agregar-producto__preview-box">img</div>
                <div className="agregar-producto__preview-copy">
                  <strong>{form.nombre || 'Creatina Monohidratada'}</strong>
                  <span>{marcas.find((m) => String(m.id) === form.marcaId)?.nombre || 'Sin marca'} · {categorias.find((c) => String(c.id) === form.categoriaId)?.nombre || 'Sin categoría'}</span>
                </div>
              </div>
              <div className="agregar-producto__preview-stats">
                <div>
                  <span>Precio</span>
                  <strong>${form.precio || '24.99'}</strong>
                </div>
                <div>
                  <span>Stock</span>
                  <strong>{form.stock || '35'} uds.</strong>
                </div>
              </div>
            </div>

            <div className="agregar-producto__tips">
              <h2>Checklist rápido</h2>
              <ul>
                <li>Usá nombres en español consistentes con el catálogo.</li>
                <li>Subí una imagen cuadrada o vertical para mejor recorte.</li>
                <li>Completá el precio original si querés mostrar descuento.</li>
              </ul>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
};

export default AgregarProducto;
