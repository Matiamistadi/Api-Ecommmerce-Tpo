import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import './Admin.css';

const Admin = () => {
  const { productos, actualizarProducto, eliminarProducto } = useProducts();
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [draft, setDraft] = useState({});

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.marca.toLowerCase().includes(busqueda.toLowerCase())
  );

  const iniciarEdicion = (p) => { setEditandoId(p.id); setDraft({ ...p }); };
  const cancelarEdicion = () => { setEditandoId(null); setDraft({}); };

  const guardarEdicion = () => {
    actualizarProducto({
      ...draft,
      precio: parseFloat(draft.precio) || 0,
      precioOriginal: draft.precioOriginal ? parseFloat(draft.precioOriginal) : null,
      stock: parseInt(draft.stock) || 0,
    });
    setEditandoId(null);
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este producto?')) eliminarProducto(id);
  };

  const stats = [
    { label: 'Total Productos', value: productos.length, sub: 'En catálogo' },
    { label: 'Stock Bajo', value: productos.filter(p => p.stock < 15).length, sub: 'Requieren atención' },
    { label: 'Categorías', value: [...new Set(productos.map(p => p.categoria))].length, sub: 'Activas' },
    { label: 'Valor Inventario', value: `$${productos.reduce((a, p) => a + p.precio * p.stock, 0).toFixed(0)}`, sub: 'Estimado' },
  ];

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <p className="admin__sidebar-brand">GymStore</p>
        <nav className="admin__sidebar-nav">
          <Link to="/" className="admin__nav-link">🏠 Ir a la Home</Link>
          <Link to="/suplementos" className="admin__nav-link">🛍️ Ver Catálogo</Link>
          <a href="#productos" className="admin__nav-link admin__nav-link--active">📦 Productos</a>
          <a href="#pedidos" className="admin__nav-link">🛒 Pedidos</a>
          <a href="#clientes" className="admin__nav-link">👥 Clientes</a>
          <a href="#ajustes" className="admin__nav-link">⚙️ Ajustes</a>
        </nav>
      </aside>

      <main className="admin__main">
        <div className="admin__header">
          <div>
            <h1 className="admin__titulo">Panel de Administración</h1>
            <p className="admin__subtitulo">Gestión de productos e inventario · Los cambios se reflejan en el catálogo</p>
          </div>
          <Link to="/agregar-producto" className="admin__btn-agregar">
            + Agregar Producto
          </Link>
        </div>

        <div className="admin__stats">
          {stats.map(s => (
            <div key={s.label} className="admin__stat-card">
              <p className="admin__stat-value">{s.value}</p>
              <p className="admin__stat-label">{s.label}</p>
              <p className="admin__stat-sub">{s.sub}</p>
            </div>
          ))}
        </div>

        <section id="productos" className="admin__tabla-seccion">
          <div className="admin__tabla-header">
            <h2 className="admin__tabla-titulo">Inventario de Productos</h2>
            <input
              type="text"
              className="admin__busqueda"
              placeholder="Buscar por nombre, marca o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
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
                {filtrados.map(p => (
                  editandoId === p.id ? (
                    <tr key={p.id} className="admin__fila-editando">
                      <td colSpan={7}>
                        <div className="admin__form-edicion">
                          <div className="admin__form-grid">
                            <div className="admin__form-field">
                              <label className="admin__form-label">Nombre</label>
                              <input className="admin__edit-input" value={draft.nombre}
                                onChange={e => setDraft({ ...draft, nombre: e.target.value })} />
                            </div>
                            <div className="admin__form-field">
                              <label className="admin__form-label">Marca</label>
                              <input className="admin__edit-input" value={draft.marca}
                                onChange={e => setDraft({ ...draft, marca: e.target.value })} />
                            </div>
                            <div className="admin__form-field">
                              <label className="admin__form-label">Categoría</label>
                              <select className="admin__edit-input" value={draft.categoria}
                                onChange={e => setDraft({ ...draft, categoria: e.target.value })}>
                                <option>Proteína</option>
                                <option>Energía</option>
                                <option>Recuperación</option>
                                <option>Fuerza</option>
                                <option>Vitaminas</option>
                              </select>
                            </div>
                            <div className="admin__form-field">
                              <label className="admin__form-label">Precio ($)</label>
                              <input className="admin__edit-input" type="number" value={draft.precio}
                                onChange={e => setDraft({ ...draft, precio: e.target.value })} />
                            </div>
                            <div className="admin__form-field">
                              <label className="admin__form-label">Precio Original ($)</label>
                              <input className="admin__edit-input" type="number" value={draft.precioOriginal || ''}
                                placeholder="Sin descuento"
                                onChange={e => setDraft({ ...draft, precioOriginal: e.target.value })} />
                            </div>
                            <div className="admin__form-field">
                              <label className="admin__form-label">Stock</label>
                              <input className="admin__edit-input" type="number" value={draft.stock}
                                onChange={e => setDraft({ ...draft, stock: e.target.value })} />
                            </div>
                            <div className="admin__form-field admin__form-field--full">
                              <label className="admin__form-label">Descripción</label>
                              <textarea className="admin__edit-input admin__edit-textarea" value={draft.descripcion}
                                onChange={e => setDraft({ ...draft, descripcion: e.target.value })} />
                            </div>
                          </div>
                          <div className="admin__form-acciones">
                            <button className="admin__btn-guardar" onClick={guardarEdicion}>✓ Guardar cambios</button>
                            <button className="admin__btn-cancelar" onClick={cancelarEdicion}>Cancelar</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={p.id}>
                      <td className="admin__producto-nombre">
                        <img src={p.imagenUrl} alt={p.nombre} className="admin__producto-img" />
                        <span>{p.nombre}</span>
                      </td>
                      <td className="admin__marca">{p.marca}</td>
                      <td><span className="admin__chip">{p.categoria}</span></td>
                      <td className="admin__precio">
                        ${p.precio.toFixed(2)}
                        {p.precioOriginal && (
                          <span className="admin__descuento">
                            {Math.round((1 - p.precio / p.precioOriginal) * 100)}% OFF
                          </span>
                        )}
                      </td>
                      <td className={`admin__stock ${p.stock < 15 ? 'admin__stock--bajo' : ''}`}>{p.stock}</td>
                      <td>
                        <span className={`admin__estado ${p.stock > 0 ? 'admin__estado--activo' : 'admin__estado--inactivo'}`}>
                          {p.stock > 0 ? 'Activo' : 'Sin stock'}
                        </span>
                      </td>
                      <td className="admin__acciones">
                        <button className="admin__btn-editar" onClick={() => iniciarEdicion(p)}>Editar</button>
                        <button className="admin__btn-eliminar" onClick={() => eliminar(p.id)}>Eliminar</button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
          <p className="admin__paginacion">Mostrando {filtrados.length} de {productos.length} productos</p>
        </section>
      </main>
    </div>
  );
};

export default Admin;
