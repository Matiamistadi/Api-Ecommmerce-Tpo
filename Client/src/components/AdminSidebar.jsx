import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingBag, Users, TrendingUp, Settings, Monitor } from 'lucide-react';

const sidebarItems = [
  { icon: Home, label: 'Ir a la Home', path: '/' },
  { icon: Package, label: 'Inventario', path: '/admin' },
  { icon: ShoppingBag, label: 'Pedidos', path: '/admin/pedidos' },
  { icon: Users, label: 'Clientes', path: '/admin/clientes' },
  { icon: TrendingUp, label: 'Analíticas', path: '/admin/analiticas' },
  { icon: Settings, label: 'Ajustes', path: '/admin/ajustes' },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#f4f4f5] h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-10">
      <div>
        <div className="flex items-center gap-3 p-6 mb-4">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800">
            <Monitor size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">Panel de<br/>Administración</h2>
            <p className="text-xs text-gray-500">Gestión de GymStore</p>
          </div>
        </div>

        <nav className="px-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname.startsWith('/admin') && item.path !== location.pathname ? false : location.pathname === item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#016b53] text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

    </aside>
  );
};

export default AdminSidebar;
