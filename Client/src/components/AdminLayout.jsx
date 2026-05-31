import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <button
        type="button"
        className="admin-layout__menu-button"
        onClick={() => setSidebarOpen((current) => !current)}
        aria-expanded={sidebarOpen}
        aria-controls="admin-sidebar"
      >
        {sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
      </button>

      <div className={`admin-layout__overlay ${sidebarOpen ? 'admin-layout__overlay--visible' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className={`admin-layout__sidebar-shell ${sidebarOpen ? 'admin-layout__sidebar-shell--open' : ''}`} id="admin-sidebar">
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
