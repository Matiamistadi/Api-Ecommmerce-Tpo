import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectProductos } from '../redux/features/productsSlice';
import { fetchResumenAdmin, selectAdminMetrics, selectAdminLoading, selectAdminError } from '../redux/features/adminSlice';
import './Admin.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const productos = useSelector(selectProductos);
  const metrics = useSelector(selectAdminMetrics);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  // Traemos las métricas reales (órdenes + clientes) del backend
  useEffect(() => {
    dispatch(fetchResumenAdmin());
  }, [dispatch]);

  const tarjetas = [
    { label: 'Total pedidos', value: metrics.totalPedidos, sub: 'Historial activo' },
    { label: 'Pedidos pendientes', value: metrics.pedidosPendientes, sub: 'Requieren revisión' },
    { label: 'Ingresos estimados', value: `$${metrics.ingresosEstimados.toFixed(0)}`, sub: 'Sesión actual' },
    { label: 'Clientes activos', value: metrics.clientesActivos, sub: 'Base registrada' },
  ];

  const accesos = [
    { to: '/admin/productos', titulo: 'Productos', texto: `${productos.length} productos cargados` },
    { to: '/admin/pedidos', titulo: 'Pedidos', texto: 'Seguimiento de estados y ventas' },
    { to: '/admin/clientes', titulo: 'Clientes', texto: 'Estado, actividad y compras' },
  ];

  return (
    <section className="admin-panel">
      <header className="admin-panel__header">
        <div>
          <p className="admin-panel__eyebrow">Dashboard</p>
          <h2 className="admin-panel__title">Inicio Admin</h2>
          <p className="admin-panel__text">Resumen general del negocio y accesos rápidos a las áreas críticas.</p>
        </div>
        <Link to="/agregar-producto" className="admin-panel__action">+ Agregar producto</Link>
      </header>

      {loading && <p className="admin-panel__muted">Cargando métricas...</p>}
      {!loading && error && (
        <p className="admin-panel__muted" style={{ color: '#dc2626' }}>
          No se pudieron cargar las métricas: {error}
        </p>
      )}

      {!loading && !error && (
      <div className="admin__stats">
        {tarjetas.map((tarjeta) => (
          <article key={tarjeta.label} className="admin__stat-card">
            <p className="admin__stat-value">{tarjeta.value}</p>
            <p className="admin__stat-label">{tarjeta.label}</p>
            <p className="admin__stat-sub">{tarjeta.sub}</p>
          </article>
        ))}
      </div>
      )}

      <section className="admin-panel__grid">
        {accesos.map((acceso) => (
          <Link key={acceso.to} to={acceso.to} className="admin-panel__card">
            <span className="admin-panel__card-kicker">Ir a {acceso.titulo}</span>
            <strong>{acceso.titulo}</strong>
            <p>{acceso.texto}</p>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default AdminDashboard;
