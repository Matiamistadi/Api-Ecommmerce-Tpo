import { useMemo, useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { X, AlertTriangle, Package, MapPin, User } from 'lucide-react';
import { getTodasLasOrdenes, actualizarEstadoOrden } from '../services/ordenService';
import { formatPrecio } from '@/lib/formato';
import { useToast } from '../context/ToastContext';
import './Admin.css';

// Estados reales de la orden en el backend (enum EstadoOrden)
const ESTADOS_PEDIDO = ['Pendiente', 'Aprobado', 'Rechazado', 'Enviado', 'Entregado', 'Cancelado'];
const filtros = ['Todos', ...ESTADOS_PEDIDO];

// Cada estado del backend se pinta reusando las clases de badge que ya existen
const BADGE_COLOR = {
  PENDIENTE: 'admin-panel__badge--pendiente',
  APROBADO: 'admin-panel__badge--activo',
  ENVIADO: 'admin-panel__badge--activo',
  ENTREGADO: 'admin-panel__badge--completado',
  RECHAZADO: 'admin-panel__badge--cancelado',
  CANCELADO: 'admin-panel__badge--cancelado',
};

// Muestra "PENDIENTE" como "Pendiente"
const formatEstado = (estado) => estado.charAt(0) + estado.slice(1).toLowerCase();

const AdminPedidos = () => {
  const { mostrarToast } = useToast();
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [confirmarCambio, setConfirmarCambio] = useState(null); // { pedido, nuevoEstado }

  // Traemos todas las órdenes reales del backend al montar el panel
  useEffect(() => {
    getTodasLasOrdenes()
      .then(setPedidos)
      .catch(() => setPedidos([]));
  }, []);

  const pedidosFiltrados = useMemo(() => (
    filtro === 'Todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)
  ), [filtro, pedidos]);

  // Métricas calculadas a partir de las órdenes reales
  const metrics = useMemo(() => {
    const enCurso = pedidos.filter((p) => ['PENDIENTE', 'APROBADO', 'ENVIADO'].includes(p.estado));
    const cancelados = pedidos.filter((p) => ['RECHAZADO', 'CANCELADO'].includes(p.estado));
    const pendientes = pedidos.filter((p) => p.estado === 'PENDIENTE');
    const ingresos = pedidos
      .filter((p) => !['RECHAZADO', 'CANCELADO'].includes(p.estado))
      .reduce((acc, p) => acc + p.total, 0);
    return {
      totalPedidos: pedidos.length,
      pedidosActivos: enCurso.length,
      pedidosCancelados: cancelados.length,
      pedidosPendientes: pendientes.length,
      ingresosEstimados: ingresos,
    };
  }, [pedidos]);

  const estadisticas = [
    { label: 'Total pedidos', value: metrics.totalPedidos, sub: 'Registrados' },
    { label: 'Pedidos activos', value: metrics.pedidosActivos, sub: 'En curso' },
    { label: 'Pedidos cancelados', value: metrics.pedidosCancelados, sub: 'No procesados' },
    { label: 'Ingresos estimados', value: `$${metrics.ingresosEstimados.toFixed(0)}`, sub: 'Ventas válidas' },
    { label: 'Pedidos pendientes', value: metrics.pedidosPendientes, sub: 'Para aprobar' },
  ];

  const solicitarCambioEstado = (pedido, nuevoEstado) => {
    if (nuevoEstado === pedido.estado) return;
    setConfirmarCambio({ pedido, nuevoEstado });
  };

  // Cambia el estado en el backend (PATCH) y refresca la fila con la respuesta
  const confirmarCambioEstado = async () => {
    try {
      const actualizado = await actualizarEstadoOrden(confirmarCambio.pedido.id, confirmarCambio.nuevoEstado);
      setPedidos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
      mostrarToast(`Pedido #${actualizado.id} actualizado a ${formatEstado(actualizado.estado)}.`);
    } catch (err) {
      mostrarToast(err.message, 'error');
    } finally {
      setConfirmarCambio(null);
    }
  };

  return (
    <div className="flex h-full bg-[#fafafa] font-sans w-full">
      <AdminSidebar />
      <main className="flex-1 ml-64 h-screen overflow-y-auto">
        <section className="admin-panel">
          <header className="admin-panel__header">
            <div>
              <p className="admin-panel__eyebrow">Pedidos</p>
              <h2 className="admin-panel__title">Gestión de pedidos</h2>
              <p className="admin-panel__text">Seguimiento de ventas, estados y valores estimados del sistema.</p>
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

          <div className="admin-panel__filters" role="tablist" aria-label="Filtrar pedidos">
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
              <h3>Listado de pedidos</h3>
              <span>{pedidosFiltrados.length} resultados</span>
            </div>

            <div className="admin-panel__table-wrapper">
              <table className="admin-panel__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>#{pedido.id}</td>
                      <td>
                        <strong>{pedido.cliente}</strong>
                        <p className="admin-panel__muted">{pedido.email}</p>
                      </td>
                      <td>{pedido.fecha}</td>
                      <td>{pedido.cantidadProductos}</td>
                      <td>{formatPrecio(pedido.total)}</td>
                      <td>
                        <span className={`admin-panel__badge ${BADGE_COLOR[pedido.estado] ?? ''}`}>
                          {formatEstado(pedido.estado)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-panel__actions">
                          <button
                            type="button"
                            className="admin-panel__button"
                            onClick={() => setPedidoDetalle(pedido)}
                          >
                            Ver detalle
                          </button>

                          <select
                            className="admin-panel__estado-select"
                            value={pedido.estado}
                            onChange={(e) => solicitarCambioEstado(pedido, e.target.value)}
                          >
                            {ESTADOS_PEDIDO.map((estado) => (
                              <option key={estado} value={estado}>{formatEstado(estado)}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>

      {/* Modal detalle del pedido */}
      {pedidoDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-[toast-slide-up_0.2s_ease-out] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Detalle del pedido</h2>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">#{pedidoDetalle.id}</p>
              </div>
              <button onClick={() => setPedidoDetalle(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Cliente */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User size={15} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{pedidoDetalle.cliente}</p>
                  <p className="text-xs text-gray-500">{pedidoDetalle.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pedidoDetalle.fecha}</p>
                </div>
                <span className={`ml-auto admin-panel__badge ${BADGE_COLOR[pedidoDetalle.estado] ?? ''}`}>
                  {formatEstado(pedidoDetalle.estado)}
                </span>
              </div>

              {/* Dirección */}
              {pedidoDetalle.direccion && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={15} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-0.5">Dirección de entrega</p>
                    <p className="text-sm text-gray-600">{pedidoDetalle.direccion}</p>
                  </div>
                </div>
              )}

              {/* Productos */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package size={15} className="text-gray-400" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Productos</p>
                </div>
                <div className="space-y-2">
                  {(pedidoDetalle.items ?? []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.nombre}</p>
                        <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatPrecio(item.precio * item.cantidad)}</p>
                        <p className="text-xs text-gray-400">{formatPrecio(item.precio)} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <span className="text-sm font-bold text-gray-700">Total del pedido</span>
                <span className="text-xl font-bold text-gray-900">{formatPrecio(pedidoDetalle.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmación cambio de estado */}
      {confirmarCambio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 animate-[toast-slide-up_0.2s_ease-out]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-orange-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Confirmar cambio de estado</h2>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Pedido <span className="font-bold font-mono text-gray-900">#{confirmarCambio.pedido.id}</span> de{' '}
              <span className="font-bold text-gray-900">{confirmarCambio.pedido.cliente}</span>.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Estado actual:{' '}
              <span className={`admin-panel__badge ${BADGE_COLOR[confirmarCambio.pedido.estado] ?? ''}`}>
                {formatEstado(confirmarCambio.pedido.estado)}
              </span>
              {' '}→{' '}
              <span className={`admin-panel__badge ${BADGE_COLOR[confirmarCambio.nuevoEstado] ?? ''}`}>
                {formatEstado(confirmarCambio.nuevoEstado)}
              </span>
            </p>
            <p className="text-xs text-orange-500 font-medium mb-6">Este cambio afecta el seguimiento del pedido del cliente.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarCambio(null)}
                className="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioEstado}
                className="px-5 py-2.5 bg-[#00e69e] hover:bg-[#00c98a] text-black rounded-lg text-sm font-bold transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPedidos;
