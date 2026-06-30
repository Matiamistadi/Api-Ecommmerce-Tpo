import { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AdminSidebar } from '../components/AdminSidebar';
import { AlertTriangle } from 'lucide-react';
import {
  fetchResumenAdmin,
  selectAdminClientes,
  selectAdminMetrics,
  selectAdminLoading,
  selectAdminError,
} from '../redux/features/adminSlice';
import {
  actualizarUsuario as actualizarUsuarioThunk,
  cambiarRol as cambiarRolThunk,
  eliminarUsuario as eliminarUsuarioThunk,
  selectUsuariosSaving,
} from '../redux/features/usersSlice';
import { selectUsuario } from '../redux/features/authSlice';
import { formatPrecio } from '@/lib/formato';
import { useToast } from '../context/ToastContext';
import './Admin.css';

const filtros = ['Todos', 'Activo', 'Suspendido'];

const AdminClientes = () => {
  const dispatch = useDispatch();
  const { mostrarToast } = useToast();
  const clientes = useSelector(selectAdminClientes);
  const metrics = useSelector(selectAdminMetrics);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const saving = useSelector(selectUsuariosSaving);
  const usuarioActual = useSelector(selectUsuario);
  const [filtro, setFiltro] = useState('Todos');
  const [confirmarCambio, setConfirmarCambio] = useState(null); // { cliente, nuevoEstado }

  // Trae usuarios reales (+ sus estadísticas de compra) del backend
  useEffect(() => {
    dispatch(fetchResumenAdmin());
  }, [dispatch]);

  const clientesFiltrados = useMemo(() => (
    filtro === 'Todos' ? clientes : clientes.filter((c) => c.estado === filtro)
  ), [clientes, filtro]);

  const estadisticas = [
    { label: 'Total clientes', value: metrics.totalClientes, sub: 'Registrados' },
    { label: 'Clientes activos', value: metrics.clientesActivos, sub: 'En sesión' },
    { label: 'Suspendidos', value: metrics.clientesSuspendidos, sub: 'En revisión' },
    { label: 'Con compras recientes', value: metrics.clientesRecientes, sub: 'Últimas compras' },
    { label: 'Promedio pedidos/cliente', value: metrics.promedioPedidos.toFixed(1), sub: 'Ratio general' },
  ];

  const solicitarCambioEstado = (cliente) => {
    const nuevoEstado = cliente.estado === 'Activo' ? 'Suspendido' : 'Activo';
    setConfirmarCambio({ cliente, nuevoEstado });
  };

  // Suspende/reactiva en el backend (PUT activo) y recarga la lista
  const confirmarCambioEstado = async () => {
    try {
      await dispatch(actualizarUsuarioThunk({
        id: confirmarCambio.cliente.id,
        datos: { activo: confirmarCambio.nuevoEstado === 'Activo' },
      })).unwrap();
      dispatch(fetchResumenAdmin());
      mostrarToast(`Cliente ${confirmarCambio.nuevoEstado === 'Activo' ? 'reactivado' : 'suspendido'}.`);
    } catch (err) {
      mostrarToast(err.message, 'error');
    } finally {
      setConfirmarCambio(null);
    }
  };

  // Cambia el rol (PATCH /rol). La lista se actualiza en memoria desde adminSlice; sólo
  // re-fetcheamos el resumen para mantener consistentes las métricas agregadas.
  const handleCambiarRol = async (cliente, rol) => {
    if (rol === cliente.rol) return;
    try {
      await dispatch(cambiarRolThunk({ id: cliente.id, rol })).unwrap();
      dispatch(fetchResumenAdmin());
      mostrarToast(`Rol de ${cliente.nombre} actualizado a ${rol === 'ADMIN' ? 'Admin' : 'Cliente'}.`);
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  };

  // Elimina un usuario (DELETE). Confirmación simple; la fila se quita en memoria y
  // re-fetcheamos el resumen para refrescar las métricas (total clientes, etc.).
  const handleEliminar = async (cliente) => {
    if (!window.confirm(`¿Eliminar al cliente ${cliente.nombre}? Esta acción no se puede deshacer.`)) return;
    try {
      await dispatch(eliminarUsuarioThunk(cliente.id)).unwrap();
      dispatch(fetchResumenAdmin());
      mostrarToast('Cliente eliminado.');
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  };

  return (
    <div className="flex h-full bg-[#fafafa] font-sans w-full">
      <AdminSidebar />
      <main className="flex-1 ml-64 h-screen overflow-y-auto">
        <section className="admin-panel">
          <header className="admin-panel__header">
            <div>
              <p className="admin-panel__eyebrow">Clientes</p>
              <h2 className="admin-panel__title">Gestión de clientes</h2>
              <p className="admin-panel__text">Seguimiento de actividad, pedidos y estado comercial de cada usuario.</p>
            </div>
          </header>

          <div className="admin__stats admin__stats--five">
            {estadisticas.map((estadistica) => (
              <article key={estadistica.label} className="admin__stat-card">
                <p className="admin__stat-value">{estadistica.value}</p>
                <p className="admin__stat-label">{estadistica.label}</p>
                <p className="admin__stat-sub">{estadistica.sub}</p>
              </article>
            ))}
          </div>

          <div className="admin-panel__filters" role="tablist" aria-label="Filtrar clientes">
            {filtros.map((opcion) => (
              <button
                key={opcion}
                type="button"
                className={`admin-panel__filter ${filtro === opcion ? 'admin-panel__filter--active' : ''}`}
                onClick={() => setFiltro(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>

          <section className="admin-panel__table-card">
            <div className="admin-panel__table-header">
              <h3>Listado de clientes</h3>
              <span>{clientesFiltrados.length} resultados</span>
            </div>

            {loading && <p className="admin-panel__muted" style={{ padding: '1.5rem' }}>Cargando clientes...</p>}
            {!loading && error && (
              <p className="admin-panel__muted" style={{ padding: '1.5rem', color: '#dc2626' }}>
                No se pudieron cargar los clientes: {error.message}
              </p>
            )}

            {!loading && !error && (
            <div className="admin-panel__table-wrapper">
              <table className="admin-panel__table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Pedidos</th>
                    <th>Última compra</th>
                    <th>Total gastado</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td><strong>{cliente.nombre} {cliente.apellido}</strong></td>
                      <td>{cliente.email}</td>
                      <td>
                        <span className={`admin-panel__badge admin-panel__badge--${cliente.estado.toLowerCase()}`}>
                          {cliente.estado}
                        </span>
                      </td>
                      <td>{cliente.pedidos}</td>
                      <td>{cliente.ultimaCompra}</td>
                      <td>{formatPrecio(cliente.totalGastado)}</td>
                      <td>
                        <select
                          className="admin-panel__estado-select"
                          value={cliente.rol}
                          disabled={saving || cliente.id === usuarioActual?.id}
                          onChange={(e) => handleCambiarRol(cliente, e.target.value)}
                          aria-label={`Rol de ${cliente.nombre}`}
                          title={cliente.id === usuarioActual?.id ? 'No podés cambiar tu propio rol' : 'Cambiar rol'}
                        >
                          <option value="CLIENTE">Cliente</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td>
                        <div className="admin-panel__actions">
                          <button
                            type="button"
                            className="admin-panel__button"
                            onClick={() => solicitarCambioEstado(cliente)}
                          >
                            {cliente.estado === 'Activo' ? 'Suspender' : 'Reactivar'}
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => handleEliminar(cliente)}
                            disabled={saving || cliente.id === usuarioActual?.id}
                            title={cliente.id === usuarioActual?.id ? 'No podés eliminar tu propia cuenta' : 'Eliminar cliente'}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </section>
        </section>
      </main>

      {/* Modal confirmación suspender/reactivar */}
      {confirmarCambio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 animate-[toast-slide-up_0.2s_ease-out]">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                confirmarCambio.nuevoEstado === 'Suspendido' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <AlertTriangle size={20} className={confirmarCambio.nuevoEstado === 'Suspendido' ? 'text-red-500' : 'text-green-600'} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {confirmarCambio.nuevoEstado === 'Suspendido' ? 'Suspender cliente' : 'Reactivar cliente'}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              ¿Estás seguro de que querés{' '}
              <span className="font-bold text-gray-900">
                {confirmarCambio.nuevoEstado === 'Suspendido' ? 'suspender' : 'reactivar'}
              </span>{' '}
              a{' '}
              <span className="font-bold text-gray-900">
                {confirmarCambio.cliente.nombre} {confirmarCambio.cliente.apellido}
              </span>?
            </p>
            <p className="text-xs text-orange-500 font-medium mb-6">
              {confirmarCambio.nuevoEstado === 'Suspendido'
                ? 'El cliente no podrá ingresar a su cuenta ni realizar compras.'
                : 'El cliente podrá volver a acceder a su cuenta y realizar compras.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarCambio(null)}
                className="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioEstado}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  confirmarCambio.nuevoEstado === 'Suspendido'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-[#00e69e] hover:bg-[#00c98a] text-black'
                }`}
              >
                {confirmarCambio.nuevoEstado === 'Suspendido' ? 'Sí, suspender' : 'Sí, reactivar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientes;
