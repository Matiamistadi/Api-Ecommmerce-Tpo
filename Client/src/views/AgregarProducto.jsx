import { Link } from 'react-router-dom';
import './AgregarProducto.css';

const campos = [
  { name: 'nombre', label: 'Nombre del producto', placeholder: 'Creatina Monohidratada' },
  { name: 'marca', label: 'Marca', placeholder: 'GymStore' },
  { name: 'categoria', label: 'Categoría', placeholder: 'Fuerza' },
  { name: 'precio', label: 'Precio', placeholder: '24.99' },
  { name: 'stock', label: 'Stock', placeholder: '35' },
  { name: 'precioOriginal', label: 'Precio original', placeholder: '29.99' },
  { name: 'imagenUrl', label: 'URL de imagen', placeholder: '/img/Producto.png' },
  { name: 'imagenDetalleUrl', label: 'URL imagen detalle', placeholder: '/img/DetalleImg/ProductoDetalle.png' },
];

const AgregarProducto = () => {
  return (
    <main className="agregar-producto">
      <section className="agregar-producto__shell">
        <header className="agregar-producto__header">
          <div>
            <p className="agregar-producto__eyebrow">Administración</p>
            <h1 className="agregar-producto__titulo">Agregar producto</h1>
            <p className="agregar-producto__texto">
              Cargá un nuevo producto con la misma lógica visual del panel: datos claros, edición simple y una tarjeta final lista para catálogo.
            </p>
          </div>
          <Link to="/admin" className="agregar-producto__back">Volver al panel</Link>
        </header>

        <section className="agregar-producto__content">
          <form className="agregar-producto__form">
            <div className="agregar-producto__grid">
              {campos.map((campo) => (
                <label key={campo.name} className="agregar-producto__field">
                  <span>{campo.label}</span>
                  <input type="text" placeholder={campo.placeholder} />
                </label>
              ))}
              <label className="agregar-producto__field agregar-producto__field--full">
                <span>Descripción</span>
                <textarea rows="5" placeholder="Describí el producto, sus beneficios y recomendaciones de uso." />
              </label>
            </div>

            <div className="agregar-producto__toggles">
              <label className="agregar-producto__toggle">
                <input type="checkbox" defaultChecked />
                <span>Producto activo</span>
              </label>
              <label className="agregar-producto__toggle">
                <input type="checkbox" />
                <span>Destacar como oferta</span>
              </label>
            </div>

            <div className="agregar-producto__actions">
              <Link to="/admin" className="agregar-producto__btn agregar-producto__btn--secondary">Cancelar</Link>
              <button type="button" className="agregar-producto__btn agregar-producto__btn--primary">Guardar producto</button>
            </div>
          </form>

          <aside className="agregar-producto__aside">
            <div className="agregar-producto__preview">
              <span className="agregar-producto__preview-chip">Vista previa</span>
              <div className="agregar-producto__preview-visual">
                <div className="agregar-producto__preview-box">img</div>
                <div className="agregar-producto__preview-copy">
                  <strong>Creatina Monohidratada</strong>
                  <span>GymStore · Fuerza</span>
                </div>
              </div>
              <div className="agregar-producto__preview-stats">
                <div>
                  <span>Precio</span>
                  <strong>$24.99</strong>
                </div>
                <div>
                  <span>Stock</span>
                  <strong>35 uds.</strong>
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