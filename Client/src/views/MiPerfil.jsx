import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAddresses } from '../context/AddressContext';
import { useCommerce } from '../context/CommerceContext';
import './MiPerfil.css';

const MiPerfil = () => {
  const { direccionesFormateadas } = useAddresses();
  const { pedidos } = useCommerce();
  const [perfil, setPerfil] = useState({
    nombre: 'Luciano Frasca',
    email: 'luciano@gymstore.com',
    telefono: '+54 11 5555-1234',
  });
  const [editando, setEditando] = useState(false);
  const [draft, setDraft] = useState({ ...perfil });

  const guardar = () => {
    setPerfil({ ...draft });
    setEditando(false);
  };

  return (
    <main className="perfil">
      <div className="perfil__container">
        <h1 className="perfil__titulo">Mi Cuenta</h1>

        <div className="perfil__layout">
          {/* Sidebar */}
          <nav className="perfil__sidebar">
            <a href="#datos" className="perfil__sidebar-link perfil__sidebar-link--active">
              👤 Mis Datos
            </a>
            <a href="#direcciones" className="perfil__sidebar-link">
              📍 Direcciones
            </a>
            <a href="#pedidos" className="perfil__sidebar-link">
              📦 Pedidos
            </a>
            <Link to="/login" className="perfil__sidebar-link perfil__sidebar-link--logout">
              ← Cerrar Sesión
            </Link>
          </nav>

          <div className="perfil__contenido">
            {/* Datos personales */}
            <section id="datos" className="perfil__seccion">
              <div className="perfil__seccion-header">
                <h2 className="perfil__seccion-title">Datos Personales</h2>
                {!editando ? (
                  <button className="perfil__btn-editar" onClick={() => setEditando(true)}>
                    Editar
                  </button>
                ) : (
                  <div className="perfil__acciones">
                    <button className="perfil__btn-cancelar" onClick={() => { setDraft({ ...perfil }); setEditando(false); }}>
                      Cancelar
                    </button>
                    <button className="perfil__btn-guardar" onClick={guardar}>
                      Guardar
                    </button>
                  </div>
                )}
              </div>

              <div className="perfil__campos">
                {[
                  { key: 'nombre', label: 'Nombre', type: 'text' },
                  { key: 'email', label: 'Email', type: 'email' },
                  { key: 'telefono', label: 'Teléfono', type: 'tel' },
                ].map(({ key, label, type }) => (
                  <div key={key} className="perfil__campo">
                    <label className="perfil__campo-label">{label}</label>
                    {editando ? (
                      <input
                        type={type}
                        className="perfil__campo-input"
                        value={draft[key]}
                        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      />
                    ) : (
                      <p className="perfil__campo-valor">{perfil[key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Direcciones */}
            <section id="direcciones" className="perfil__seccion">
              <div className="perfil__seccion-header">
                <h2 className="perfil__seccion-title">Direcciones de Envío</h2>
                <Link to="/agregar-direccion" className="perfil__btn-editar">+ Agregar</Link>
              </div>
              <div className="perfil__direcciones-lista">
                {direccionesFormateadas.map((direccion) => (
                  <div key={direccion.id} className="perfil__direccion">
                    <div className="perfil__direccion-tag">{direccion.principal ? 'Principal' : 'Guardada'}</div>
                    <p className="perfil__direccion-texto">{direccion.etiqueta}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Historial de pedidos */}
            <section id="pedidos" className="perfil__seccion">
              <h2 className="perfil__seccion-title">Historial de Pedidos</h2>
              <div className="perfil__pedidos">
                {pedidos.slice(0, 3).map((pedido) => (
                  <div key={pedido.id} className="perfil__pedido">
                    <div className="perfil__pedido-header">
                      <span className="perfil__pedido-id">{pedido.id}</span>
                      <span className={`perfil__pedido-estado perfil__pedido-estado--${pedido.estado === 'Completado' ? 'ok' : 'transito'}`}>
                        {pedido.estado === 'Completado' ? '✓' : '🚚'} {pedido.estado}
                      </span>
                    </div>
                    <p className="perfil__pedido-fecha">{pedido.fecha}</p>
                    {pedido.items.map((item) => (
                      <p key={item.nombre} className="perfil__pedido-item">
                        · {item.nombre} × {item.cantidad} — ${item.precio.toFixed(2)}
                      </p>
                    ))}
                    <p className="perfil__pedido-total">Total: ${pedido.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MiPerfil;
