import { useMemo, useState, useRef, useEffect } from 'react';
import { useCommerce } from '../context/CommerceContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { X, AlertTriangle, Package, MapPin, User, ChevronDown } from 'lucide-react';
import './Admin.css';

const ESTADOS_PEDIDO = ['Pendiente', 'Activo', 'Completado', 'Cancelado'];
const filtros = ['Todos', ...ESTADOS_PEDIDO];

const BADGE_COLOR = {
  activo: 'admin-panel__badge--activo',
  pendiente: 'admin-panel__badge--pendiente',
  completado: 'admin-panel__badge--completado',
  cancelado: 'admin-panel__badge--cancelado',
};

const AdminPedidos = () => {
  const { pedidos, metrics, cambiarEstadoPedido } = useCommerce();
  const [filtro, setFiltro] = useState('Todos');
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [confirmarCambio, setConfirmarCambio] = useState(null); // { pedido, nuevoEstado }
  const [dropdownAbierto, setDropdownAbierto] = useState(null);
  const dropdownRef = useRef(null);

  const pedidosFiltrados = useMemo(() => (
    filtro === 'Todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)
  ), [filtro, pedidos]);

  const estadisticas = [
    { label: 'Total pedidos', value: metrics.totalPedidos, sub: 'Registrados' },
    { label: 'Pedidos activos', value: metrics.pedidosActivos, sub: 'En curso' },
    { label: 'Pedidos cancelados', value: metrics.pedidosCancelados, sub: 'No procesados' },
    { label: 'Ingresos estimados', value: `$${metrics.ingresosEstimados.toFixed(0)}`, sub: 'Sesión actual' },
    { label: 'Pedidos pendientes', value: metrics.pedidosPendientes, sub: 'Para aprobar' },
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAbierto(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const solicitarCambioEstado = (pedido, nuevoEstado) => {
    setDropdownAbierto(null);
    if (nuevoEstado === pedido.estado) return;
    setConfirmarCambio({ pedido, nuevoEstado });
  };

  const confirmarCambioEstado = () => {
    cambiarEstadoPedido(confirmarCambio.pedido.id, confirmarCambio.nuevoEstado);
    setConfirmarCambio(null);
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
                      <td>{pedido.id}</td>
                      <td>
                        <strong>{pedido.cliente}</strong>
                        <p className="admin-panel__muted">{pedido.email}</p>
                      </td>
                      <td>{pedido.fecha}</td>
                      <td>{pedido.cantidadProductos}</td>
                      <td>${pedido.total.toFixed(2)}</td>
                      <td>
                        <span className={`admin-panel__badge ${BADGE_COLOR[pedido.estado.toLowerCase()] ?? ''}`}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td>
                        <div className="admin-panel__actions" ref={dropdownAbierto === pedido.id ? dropdownRef : null}>
                          <button
                            type="button"
                            className="admin-panel__button"
                            onClick={() => setPedidoDetalle(pedido)}
                          >
                            Ver detalle
                          </button>

                          <div className="relative">
                            <button
                              type="button"
                              className="admin-panel__button flex items-center gap-1"
                              onClick={() => setDropdownAbierto(dropdownAbierto === pedido.id ? null : pedido.id)}
                            >
                              Cambiar estado
                              <ChevronDown size={13} />
                            </button>

                            {dropdownAbierto === pedido.id && (
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-30 overflow-hidden">
                                {ESTADOS_PEDIDO.map((estado) => (
                                  <button
                                    key={estado}
                                    type="button"
                                    onClick={() => solicitarCambioEstado(pedido, estado)}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 ${
                                      pedido.estado === estado ? 'text-[#00c98a] font-bold bg-[#f0fff9]' : 'text-gray-700'
                                    }`}
                                  >
                                    {estado}
                                    {pedido.estado === estado && <span className="ml-1 text-xs">✓</span>}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
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
                <p className="text-xs text-gray-500 mt-0.5 font-mono">{pedidoDetalle.id}</p>
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
                <span className={`ml-auto admin-panel__badge ${BADGE_COLOR[pedidoDetalle.estado.toLowerCase()] ?? ''}`}>
                  {pedidoDetalle.estado}
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
                        <p className="text-sm font-bold text-gray-900">${(item.precio * item.cantidad).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">${item.precio.toFixed(2)} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <span className="text-sm font-bold text-gray-700">Total del pedido</span>
                <span className="text-xl font-bold text-gray-900">${pedidoDetalle.total.toFixed(2)}</span>
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
              Pedido <span className="font-bold font-mono text-gray-900">{confirmarCambio.pedido.id}</span> de{' '}
              <span className="font-bold text-gray-900">{confirmarCambio.pedido.cliente}</span>.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Estado actual:{' '}
              <span className={`admin-panel__badge ${BADGE_COLOR[confirmarCambio.pedido.estado.toLowerCase()] ?? ''}`}>
                {confirmarCambio.pedido.estado}
              </span>
              {' '}→{' '}
              <span className={`admin-panel__badge ${BADGE_COLOR[confirmarCambio.nuevoEstado.toLowerCase()] ?? ''}`}>
                {confirmarCambio.nuevoEstado}
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
