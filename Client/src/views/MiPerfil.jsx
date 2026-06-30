import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, ShoppingBag, LogOut, Lock, Trash2, Pencil } from 'lucide-react';
import './MiPerfil.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSelector, useDispatch } from 'react-redux';
import { selectUsuario, logout as logoutAction } from '../redux/features/authSlice';
import {
  fetchUsuarioActual,
  actualizarUsuario as actualizarUsuarioThunk,
  cambiarPassword as cambiarPasswordThunk,
} from '../redux/features/usersSlice';
import {
  fetchDirecciones,
  eliminarDireccion as eliminarDireccionThunk,
  actualizarDireccion as actualizarDireccionThunk,
  selectDirecciones,
  selectDireccionesLoading,
  selectDireccionesSaving,
  selectDireccionesError,
} from '../redux/features/direccionesSlice';
import {
  fetchOrdenesUsuario,
  selectOrdenes,
  selectOrdenesLoading,
  selectOrdenesError,
} from '../redux/features/ordersSlice';
import { useToast } from '../context/ToastContext';
import { formatPrecio } from '@/lib/formato';

const MiPerfil = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const usuario = useSelector(selectUsuario);
  const direcciones = useSelector(selectDirecciones);
  const direccionesLoading = useSelector(selectDireccionesLoading);
  const direccionesSaving = useSelector(selectDireccionesSaving);
  const direccionesError = useSelector(selectDireccionesError);
  const pedidos = useSelector(selectOrdenes);
  const pedidosLoading = useSelector(selectOrdenesLoading);
  const pedidosError = useSelector(selectOrdenesError);
  const logout = () => dispatch(logoutAction());
  const { mostrarToast } = useToast();
  const [perfil, setPerfil] = useState({
    nombre: '',
    email: usuario?.email || '',
    telefono: '',
  });

  const [guardandoDatos, setGuardandoDatos] = useState(false);

  // Al entrar al perfil, traemos los datos reales del usuario, sus direcciones y sus pedidos
  useEffect(() => {
    if (usuario?.id) {
      // Datos personales (nombre, email, teléfono): sincronizamos el form recién cuando llega la respuesta
      dispatch(fetchUsuarioActual(usuario.id)).unwrap()
        .then((u) => setPerfil({
          nombre: u.nombre || '',
          email: u.email || '',
          telefono: u.telefono || '',
        }))
        .catch(() => {});

      dispatch(fetchDirecciones(usuario.id));
      dispatch(fetchOrdenesUsuario(usuario.id));
    }
  }, [usuario, dispatch]);

  // Guarda nombre y teléfono en el backend (el email no se cambia acá para no invalidar la sesión)
  const handleSave = async (e) => {
    e.preventDefault();
    setGuardandoDatos(true);
    try {
      await dispatch(actualizarUsuarioThunk({
        id: usuario.id,
        datos: { nombre: perfil.nombre, telefono: perfil.telefono },
      })).unwrap();
      mostrarToast('Datos guardados correctamente.');
    } catch (err) {
      mostrarToast(err.message, 'error');
    } finally {
      setGuardandoDatos(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEliminarDireccion = async (id) => {
    try {
      await dispatch(eliminarDireccionThunk({ usuarioId: usuario.id, direccionId: id })).unwrap();
      mostrarToast('Dirección eliminada.');
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  };

  // Edición de dirección: form inline mínimo sobre los campos que guarda el backend
  const [editandoDireccion, setEditandoDireccion] = useState(null); // id en edición
  const [formDireccion, setFormDireccion] = useState({ calle: '', ciudad: '', provincia: '', codigoPostal: '' });

  const abrirEditarDireccion = (dir) => {
    setEditandoDireccion(dir.id);
    setFormDireccion({
      calle: dir.calle || '',
      ciudad: dir.ciudad || '',
      provincia: dir.provincia || '',
      codigoPostal: dir.codigoPostal || '',
    });
  };

  // PUT de la dirección. La lista se actualiza en memoria (sin re-fetch).
  const handleGuardarDireccion = async (dir) => {
    try {
      await dispatch(actualizarDireccionThunk({
        usuarioId: usuario.id,
        direccionId: dir.id,
        direccion: { ...formDireccion, esPrincipal: dir.esPrincipal },
      })).unwrap();
      setEditandoDireccion(null);
      mostrarToast('Dirección actualizada.');
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  };

  // Estado del cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [guardandoPassword, setGuardandoPassword] = useState(false);

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    if (!passwordActual) {
      setErrorPassword('Ingresá tu contraseña actual.');
      return;
    }
    if (nuevaPassword.length < 8) {
      setErrorPassword('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      setErrorPassword('Las contraseñas no coinciden.');
      return;
    }
    setGuardandoPassword(true);
    setErrorPassword('');
    try {
      await dispatch(cambiarPasswordThunk({ id: usuario.id, passwordActual, passwordNueva: nuevaPassword })).unwrap();
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');
      mostrarToast('Contraseña actualizada correctamente.');
    } catch (err) {
      setErrorPassword(err.message);
    } finally {
      setGuardandoPassword(false);
    }
  };

  return (
    <main className="perfil">
      <div className="perfil__container">

        {/* Header con Título y Loyalty Card */}
        <header className="perfil__header">
          <div className="perfil__header-left">
            <h1 className="perfil__titulo">Mi Cuenta</h1>
            <p className="perfil__subtitulo">Gestión de perfil, pedidos y direcciones.</p>
          </div>
          <button type="button" className="perfil__btn-logout" onClick={handleLogout}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </header>

        {/* Layout en Grid */}
        <div className="perfil__grid">

          {/* Columna Izquierda (Datos y Direcciones) */}
          <div className="perfil__grid-left">

            {/* Tarjeta de Datos Personales */}
            <section className="perfil__card">
              <div className="perfil__card-header">
                <User size={20} className="perfil__card-icon" />
                <h2 className="perfil__card-title">Mis Datos</h2>
              </div>

              <form onSubmit={handleSave} className="perfil__form">
                <div className="perfil__form-field">
                  <Label htmlFor="nombre" className="perfil__form-label">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    className="perfil__form-input h-auto"
                    value={perfil.nombre}
                    onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                  />
                </div>

                <div className="perfil__form-field">
                  <Label htmlFor="email" className="perfil__form-label">Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    className="perfil__form-input h-auto opacity-60 cursor-not-allowed"
                    value={perfil.email}
                    disabled
                  />
                </div>

                <div className="perfil__form-field">
                  <Label htmlFor="telefono" className="perfil__form-label">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    className="perfil__form-input h-auto"
                    value={perfil.telefono}
                    onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                  />
                </div>

                <Button type="submit" className="perfil__btn-guardar-cambios h-auto" disabled={guardandoDatos}>
                  {guardandoDatos ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </form>
            </section>

            {/* Tarjeta de Cambio de Contraseña */}
            <section className="perfil__card">
              <div className="perfil__card-header">
                <Lock size={20} className="perfil__card-icon" />
                <h2 className="perfil__card-title">Cambiar contraseña</h2>
              </div>

              <form onSubmit={handleCambiarPassword} className="perfil__form">
                <div className="perfil__form-field">
                  <Label htmlFor="passwordActual" className="perfil__form-label">Contraseña actual</Label>
                  <Input
                    id="passwordActual"
                    type="password"
                    className="perfil__form-input h-auto"
                    placeholder="Tu contraseña actual"
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                  />
                </div>

                <div className="perfil__form-field">
                  <Label htmlFor="nuevaPassword" className="perfil__form-label">Nueva contraseña</Label>
                  <Input
                    id="nuevaPassword"
                    type="password"
                    className="perfil__form-input h-auto"
                    placeholder="Mínimo 8 caracteres"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                  />
                </div>

                <div className="perfil__form-field">
                  <Label htmlFor="confirmarPassword" className="perfil__form-label">Confirmar contraseña</Label>
                  <Input
                    id="confirmarPassword"
                    type="password"
                    className="perfil__form-input h-auto"
                    placeholder="••••••••"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                  />
                </div>

                {errorPassword && (
                  <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{errorPassword}</span>
                )}

                <Button type="submit" className="perfil__btn-guardar-cambios h-auto" disabled={guardandoPassword}>
                  {guardandoPassword ? 'Guardando...' : 'Actualizar contraseña'}
                </Button>
              </form>
            </section>

            {/* Tarjeta de Direcciones de Envío */}
            <section className="perfil__card">
              <div className="perfil__card-header">
                <MapPin size={20} className="perfil__card-icon" />
                <h2 className="perfil__card-title">Direcciones de Envío</h2>
              </div>

              {direccionesLoading && (
                <p style={{ color: '#888', fontSize: '0.875rem', margin: '0 0 1rem' }}>Cargando direcciones...</p>
              )}

              {!direccionesLoading && direccionesError && (
                <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: '0 0 1rem' }}>
                  No se pudieron cargar las direcciones: {direccionesError.message}
                </p>
              )}

              {!direccionesLoading && !direccionesError && direcciones.map((dir) => (
                <div key={dir.id} className="perfil__address-box">
                  <div className="perfil__address-header">
                    <span className="perfil__address-tag">
                      {dir.esPrincipal ? 'Principal' : 'Dirección'}
                    </span>
                    <div className="perfil__address-actions">
                      {dir.esPrincipal && <span className="perfil__address-badge">Predeterminada</span>}
                      {editandoDireccion !== dir.id && (
                        <button
                          type="button"
                          className="perfil__address-delete"
                          onClick={() => abrirEditarDireccion(dir)}
                          aria-label="Editar dirección"
                          title="Editar dirección"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="perfil__address-delete"
                        onClick={() => handleEliminarDireccion(dir.id)}
                        disabled={direccionesSaving}
                        aria-label="Eliminar dirección"
                        title="Eliminar dirección"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {editandoDireccion === dir.id ? (
                    <div className="perfil__form" style={{ marginTop: '0.75rem' }}>
                      <div className="perfil__form-field">
                        <Label className="perfil__form-label">Calle</Label>
                        <Input
                          className="perfil__form-input h-auto"
                          value={formDireccion.calle}
                          onChange={(e) => setFormDireccion({ ...formDireccion, calle: e.target.value })}
                        />
                      </div>
                      <div className="perfil__form-field">
                        <Label className="perfil__form-label">Ciudad</Label>
                        <Input
                          className="perfil__form-input h-auto"
                          value={formDireccion.ciudad}
                          onChange={(e) => setFormDireccion({ ...formDireccion, ciudad: e.target.value })}
                        />
                      </div>
                      <div className="perfil__form-field">
                        <Label className="perfil__form-label">Provincia</Label>
                        <Input
                          className="perfil__form-input h-auto"
                          value={formDireccion.provincia}
                          onChange={(e) => setFormDireccion({ ...formDireccion, provincia: e.target.value })}
                        />
                      </div>
                      <div className="perfil__form-field">
                        <Label className="perfil__form-label">Código postal</Label>
                        <Input
                          className="perfil__form-input h-auto"
                          value={formDireccion.codigoPostal}
                          onChange={(e) => setFormDireccion({ ...formDireccion, codigoPostal: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          type="button"
                          className="perfil__btn-guardar-cambios h-auto"
                          onClick={() => handleGuardarDireccion(dir)}
                          disabled={direccionesSaving}
                        >
                          {direccionesSaving ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-auto"
                          onClick={() => setEditandoDireccion(null)}
                          disabled={direccionesSaving}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="perfil__address-text">
                      {dir.calle}<br />
                      {dir.ciudad}{dir.provincia ? `, ${dir.provincia}` : ''}<br />
                      {dir.codigoPostal ? `CP ${dir.codigoPostal}` : ''}
                    </p>
                  )}
                </div>
              ))}

              {!direccionesLoading && !direccionesError && direcciones.length === 0 && (
                <p style={{ color: '#888', fontSize: '0.875rem', margin: '0 0 1rem' }}>Todavía no tenés direcciones guardadas.</p>
              )}

              <Link to="/agregar-direccion" style={{ textDecoration: 'none' }}>
                <Button variant="outline" className="perfil__btn-add-address h-auto">
                  + Añadir Dirección
                </Button>
              </Link>
            </section>

          </div>

          {/* Columna Derecha (Historial de Pedidos) */}
          <div className="perfil__grid-right">

            {/* Tarjeta de Pedidos */}
            <section className="perfil__card">
              <div className="perfil__card-header-with-action">
                <div className="perfil__card-header-left">
                  <ShoppingBag size={20} className="perfil__card-icon" />
                  <h2 className="perfil__card-title">Historial de Pedidos</h2>
                </div>
              </div>

              {pedidosLoading && (
                <p style={{ color: '#888', fontSize: '0.875rem', padding: '1rem' }}>Cargando pedidos...</p>
              )}

              {!pedidosLoading && pedidosError && (
                <p style={{ color: '#dc2626', fontSize: '0.875rem', padding: '1rem' }}>
                  No se pudieron cargar los pedidos: {pedidosError.message}
                </p>
              )}

              {!pedidosLoading && !pedidosError && (
              <div style={{ overflowX: 'auto' }}>
                <table className="perfil__orders-table">
                  <thead className="perfil__orders-thead">
                    <tr className="perfil__orders-thead-tr">
                      <th>Producto</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody className="perfil__orders-tbody">
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id} className="perfil__orders-row">

                        <td>
                          <div className="perfil__product-cell">
                            <div className="perfil__product-img-box">
                              <img
                                src={pedido.imagen}
                                alt={pedido.productoNombre}
                                className="perfil__product-img"
                              />
                            </div>
                            <div className="perfil__product-info">
                              <span className="perfil__product-name">{pedido.productoNombre}</span>
                              <span className="perfil__product-desc">{pedido.descripcion}</span>
                              <span className="perfil__product-badge">Orden {pedido.numero}</span>
                            </div>
                          </div>
                        </td>

                        <td className="perfil__date-cell">
                          {pedido.fecha}
                        </td>

                        <td>
                          <span className={`perfil__status-badge perfil__status-badge--${pedido.estado.toLowerCase()}`}>
                            {pedido.estado}
                          </span>
                        </td>

                        <td className="perfil__total-cell">
                          {formatPrecio(pedido.total)}
                        </td>
                      </tr>
                    ))}

                    {pedidos.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                          Todavía no realizaste ninguna compra.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              )}
            </section>

          </div>

        </div>
      </div>
    </main>
  );
};

export default MiPerfil;
