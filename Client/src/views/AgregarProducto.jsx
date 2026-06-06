import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import './AgregarProducto.css';

const initialForm = {
  nombre: '',
  marca: 'GymStore',
  categoria: 'Fuerza',
  precio: '',
  stock: '',
  precioOriginal: '',
  imagenUrl: '/img/BannerNexa.png',
  imagenDetalleUrl: '/img/BannerNexa.png',
  descripcion: '',
  activo: true,
  oferta: false,
};

const categorias = ['Proteína', 'Energía', 'Recuperación', 'Fuerza'];

const AgregarProducto = () => {
  const navigate = useNavigate();
  const { agregarProducto } = useProducts();
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const guardar = () => {
    if (!form.nombre || !form.precio || !form.stock) {
      return;
    }

    const nuevoProducto = agregarProducto({
      ...form,
      precio: Number(form.precio),
      precioOriginal: form.precioOriginal ? Number(form.precioOriginal) : null,
      stock: Number(form.stock),
      imagenUrl: form.imagenUrl || '/img/BannerNexa.png',
      imagenDetalleUrl: form.imagenDetalleUrl || form.imagenUrl || '/img/BannerNexa.png',
      descripcion: form.descripcion || `${form.nombre} · ${form.categoria}`,
    });

    navigate(`/productos/${nuevoProducto.id}`);
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
                <input name="marca" type="text" value={form.marca} onChange={handleChange} placeholder="GymStore" />
              </label>
              <label className="agregar-producto__field">
                <span>Categoría</span>
                <select name="categoria" value={form.categoria} onChange={handleChange}>
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>{categoria}</option>
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
                <span>Precio original</span>
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
              <label className="agregar-producto__toggle">
                <input name="oferta" type="checkbox" checked={form.oferta} onChange={handleChange} />
                <span>Destacar como oferta</span>
              </label>
            </div>

            <div className="agregar-producto__actions">
              <Link to="/admin/productos" className="agregar-producto__btn agregar-producto__btn--secondary">Cancelar</Link>
              <button type="button" className="agregar-producto__btn agregar-producto__btn--primary" onClick={guardar}>Guardar producto</button>
            </div>
          </form>

          <aside className="agregar-producto__aside">
            <div className="agregar-producto__preview">
              <span className="agregar-producto__preview-chip">Vista previa</span>
              <div className="agregar-producto__preview-visual">
                <div className="agregar-producto__preview-box">img</div>
                <div className="agregar-producto__preview-copy">
                  <strong>{form.nombre || 'Creatina Monohidratada'}</strong>
                  <span>{form.marca} · {form.categoria}</span>
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
