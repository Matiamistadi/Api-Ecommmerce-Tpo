import { useMemo, useState } from 'react';
import { useCommerce } from '../context/CommerceContext';
import './Admin.css';

const filtros = ['Todos', 'Activo', 'Pendiente', 'Completado', 'Cancelado'];

const AdminPedidos = () => {
  const { pedidos, metrics, cambiarEstadoPedido } = useCommerce();
  const [filtro, setFiltro] = useState('Todos');

  const pedidosFiltrados = useMemo(() => (
    filtro === 'Todos' ? pedidos : pedidos.filter((pedido) => pedido.estado === filtro)
  ), [filtro, pedidos]);

  const estadisticas = [
    { label: 'Total pedidos', value: metrics.totalPedidos, sub: 'Registrados' },
    { label: 'Pedidos activos', value: metrics.pedidosActivos, sub: 'En curso' },
    { label: 'Pedidos cancelados', value: metrics.pedidosCancelados, sub: 'No procesados' },
    { label: 'Ingresos estimados', value: `$${metrics.ingresosEstimados.toFixed(0)}`, sub: 'Sesión actual' },
    { label: 'Pedidos pendientes', value: metrics.pedidosPendientes, sub: 'Para aprobar' },
  ];

  const siguienteEstado = (estado) => {
    if (estado === 'Pendiente') return 'Completado';
    if (estado === 'Activo') return 'Pendiente';
    if (estado === 'Completado') return 'Activo';
    return 'Pendiente';
  };

  return (
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
                    <span className={`admin-panel__badge admin-panel__badge--${pedido.estado.toLowerCase()}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>
                    <div className="admin-panel__actions">
                      <button type="button" className="admin-panel__button" onClick={() => cambiarEstadoPedido(pedido.id, siguienteEstado(pedido.estado))}>
                        Cambiar estado
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default AdminPedidos;
