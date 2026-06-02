import { useMemo, useState } from 'react';
import { useCommerce } from '../context/CommerceContext';
import { AdminSidebar } from '../components/AdminSidebar';
import './Admin.css';

const filtros = ['Todos', 'Activo', 'Suspendido'];

const AdminClientes = () => {
  const { clientes, metrics, cambiarEstadoCliente } = useCommerce();
  const [filtro, setFiltro] = useState('Todos');

  const clientesFiltrados = useMemo(() => (
    filtro === 'Todos' ? clientes : clientes.filter((cliente) => cliente.estado === filtro)
  ), [clientes, filtro]);

  const estadisticas = [
    { label: 'Total clientes', value: metrics.totalClientes, sub: 'Registrados' },
    { label: 'Clientes activos', value: metrics.clientesActivos, sub: 'En sesión' },
    { label: 'Suspendidos', value: metrics.clientesSuspendidos, sub: 'En revisión' },
    { label: 'Con compras recientes', value: metrics.clientesRecientes, sub: 'Últimas compras' },
    { label: 'Promedio pedidos/cliente', value: metrics.promedioPedidos.toFixed(1), sub: 'Ratio general' },
  ];

  const siguienteEstado = (estado) => (estado === 'Activo' ? 'Suspendido' : 'Activo');

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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>
                    <strong>{cliente.nombre} {cliente.apellido}</strong>
                  </td>
                  <td>{cliente.email}</td>
                  <td>
                    <span className={`admin-panel__badge admin-panel__badge--${cliente.estado.toLowerCase()}`}>
                      {cliente.estado}
                    </span>
                  </td>
                  <td>{cliente.pedidos}</td>
                  <td>{cliente.ultimaCompra}</td>
                  <td>${cliente.totalGastado.toFixed(2)}</td>
                  <td>
                    <div className="admin-panel__actions">
                      <button type="button" className="admin-panel__button" onClick={() => cambiarEstadoCliente(cliente.id, siguienteEstado(cliente.estado))}>
                        {cliente.estado === 'Activo' ? 'Suspender' : 'Reactivar'}
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
      </main>
    </div>
  );
};

export default AdminClientes;
