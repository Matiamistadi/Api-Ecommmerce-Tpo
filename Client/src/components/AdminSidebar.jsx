import { NavLink, Link } from 'react-router-dom';
import './AdminLayout.css';

const AdminSidebar = ({ onNavigate }) => {
  const linkClassName = ({ isActive }) => (
    isActive ? 'admin-sidebar__link admin-sidebar__link--active' : 'admin-sidebar__link'
  );

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <p className="admin-sidebar__eyebrow">Admin</p>
        <h1 className="admin-sidebar__title">GymStore</h1>
        <p className="admin-sidebar__subtitle">Panel de administración</p>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Navegación administrativa">
        <NavLink to="/admin" end className={linkClassName} onClick={onNavigate}>Inicio Admin</NavLink>
        <NavLink to="/admin/productos" className={linkClassName} onClick={onNavigate}>Productos</NavLink>
        <NavLink to="/admin/pedidos" className={linkClassName} onClick={onNavigate}>Pedidos</NavLink>
        <NavLink to="/admin/clientes" className={linkClassName} onClick={onNavigate}>Clientes</NavLink>
      </nav>

      <div className="admin-sidebar__footer">
        <Link to="/" className="admin-sidebar__public-link" onClick={onNavigate}>Volver al sitio</Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
