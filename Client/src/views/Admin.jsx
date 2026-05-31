import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import './Admin.css';

const Admin = () => {
  const { productos, actualizarProducto, eliminarProducto } = useProducts();
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [draft, setDraft] = useState({});

  const filtrados = productos.filter((producto) => (
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    || producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
    || producto.marca.toLowerCase().includes(busqueda.toLowerCase())
  ));

  const iniciarEdicion = (producto) => {
    setEditandoId(producto.id);
    setDraft({ ...producto });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setDraft({});
  };

  const guardarEdicion = () => {
    actualizarProducto({
      ...draft,
      precio: parseFloat(draft.precio) || 0,
      precioOriginal: draft.precioOriginal ? parseFloat(draft.precioOriginal) : null,
      stock: parseInt(draft.stock, 10) || 0,
    });
    setEditandoId(null);
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      eliminarProducto(id);
    }
  };

  const stats = [
    { label: 'Total Productos', value: productos.length, sub: 'En catálogo' },
    { label: 'Stock Bajo', value: productos.filter((producto) => producto.stock < 15).length, sub: 'Requieren atención' },
    { label: 'Categorías', value: [...new Set(productos.map((producto) => producto.categoria))].length, sub: 'Activas' },
    { label: 'Valor Inventario', value: `$${productos.reduce((acumulado, producto) => acumulado + producto.precio * producto.stock, 0).toFixed(0)}`, sub: 'Estimado' },
  ];

  return (
    <section className="admin-productos">
      <div className="admin__header">
        <div>
          <p className="admin-panel__eyebrow">Productos</p>
          <h1 className="admin__titulo">Panel de Administración</h1>
          <p className="admin__subtitulo">Gestión de productos e inventario · Los cambios se reflejan en el catálogo</p>
        </div>
        <Link to="/agregar-producto" className="admin__btn-agregar">+ Agregar Producto</Link>
      </div>

      <div className="admin__stats">
        {stats.map((stat) => (
          <article key={stat.label} className="admin__stat-card">
            <p className="admin__stat-value">{stat.value}</p>
            <p className="admin__stat-label">{stat.label}</p>
            <p className="admin__stat-sub">{stat.sub}</p>
          </article>
        ))}
      </div>

      <section className="admin__tabla-seccion">
        <div className="admin__tabla-header">
          <div>
            <h2 className="admin__tabla-titulo">Inventario de Productos</h2>
            <p className="admin__subtitulo">Editá, eliminá o agregá productos desde una sola vista sincronizada.</p>
          </div>
          <input
            type="text"
            className="admin__busqueda"
            placeholder="Buscar por nombre, marca o categoría..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>

        <div className="admin__tabla-wrapper">
          <table className="admin__tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((producto) => (
                editandoId === producto.id ? (
                  <tr key={producto.id} className="admin__fila-editando">
                    <td colSpan={7}>
                      <div className="admin__form-edicion">
                        <div className="admin__form-grid">
                          <div className="admin__form-field">
                            <label className="admin__form-label">Nombre</label>
                            <input className="admin__edit-input" value={draft.nombre} onChange={(event) => setDraft({ ...draft, nombre: event.target.value })} />
                          </div>
                          <div className="admin__form-field">
                            <label className="admin__form-label">Marca</label>
                            <input className="admin__edit-input" value={draft.marca} onChange={(event) => setDraft({ ...draft, marca: event.target.value })} />
                          </div>
                          <div className="admin__form-field">
                            <label className="admin__form-label">Categoría</label>
                            <select className="admin__edit-input" value={draft.categoria} onChange={(event) => setDraft({ ...draft, categoria: event.target.value })}>
                              <option>Proteína</option>
                              <option>Energía</option>
                              <option>Recuperación</option>
                              <option>Fuerza</option>
                              <option>Vitaminas</option>
                            </select>
                          </div>
                          <div className="admin__form-field">
                            <label className="admin__form-label">Precio ($)</label>
                            <input className="admin__edit-input" type="number" value={draft.precio} onChange={(event) => setDraft({ ...draft, precio: event.target.value })} />
                          </div>
                          <div className="admin__form-field">
                            <label className="admin__form-label">Precio Original ($)</label>
                            <input className="admin__edit-input" type="number" value={draft.precioOriginal || ''} placeholder="Sin descuento" onChange={(event) => setDraft({ ...draft, precioOriginal: event.target.value })} />
                          </div>
                          <div className="admin__form-field">
                            <label className="admin__form-label">Stock</label>
                            <input className="admin__edit-input" type="number" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: event.target.value })} />
                          </div>
                          <div className="admin__form-field admin__form-field--full">
                            <label className="admin__form-label">Descripción</label>
                            <textarea className="admin__edit-input admin__edit-textarea" value={draft.descripcion} onChange={(event) => setDraft({ ...draft, descripcion: event.target.value })} />
                          </div>
                        </div>
                        <div className="admin__form-acciones">
                          <button className="admin__btn-guardar" onClick={guardarEdicion} type="button">✓ Guardar cambios</button>
                          <button className="admin__btn-cancelar" onClick={cancelarEdicion} type="button">Cancelar</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={producto.id}>
                    <td className="admin__producto-nombre">
                      <img src={producto.imagenUrl} alt={producto.nombre} className="admin__producto-img" />
                      <span>{producto.nombre}</span>
                    </td>
                    <td className="admin__marca">{producto.marca}</td>
                    <td><span className="admin__chip">{producto.categoria}</span></td>
                    <td className="admin__precio">
                      ${producto.precio.toFixed(2)}
                      {producto.precioOriginal && (
                        <span className="admin__descuento">{Math.round((1 - producto.precio / producto.precioOriginal) * 100)}% OFF</span>
                      )}
                    </td>
                    <td className={`admin__stock ${producto.stock < 15 ? 'admin__stock--bajo' : ''}`}>{producto.stock}</td>
                    <td>
                      <span className={`admin__estado ${producto.stock > 0 ? 'admin__estado--activo' : 'admin__estado--inactivo'}`}>
                        {producto.stock > 0 ? 'Activo' : 'Sin stock'}
                      </span>
                    </td>
                    <td className="admin__acciones">
                      <button className="admin__btn-editar" onClick={() => iniciarEdicion(producto)} type="button">Editar</button>
                      <button className="admin__btn-eliminar" onClick={() => eliminar(producto.id)} type="button">Eliminar</button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>

        <p className="admin__paginacion">Mostrando {filtrados.length} de {productos.length} productos</p>
      </section>
    </section>
  );
};

export default Admin;
