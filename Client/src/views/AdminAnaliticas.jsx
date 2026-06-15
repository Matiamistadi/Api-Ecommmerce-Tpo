import { useEffect, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { getResumenAdmin, METRICS_VACIAS } from '../services/adminService';

const AdminAnaliticas = () => {
  const { productos } = useProducts();
  const [metrics, setMetrics] = useState(METRICS_VACIAS);
  const [pedidos, setPedidos] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);

  // Traemos órdenes + métricas + ventas por mes reales del backend
  useEffect(() => {
    getResumenAdmin()
      .then((resumen) => {
        setMetrics(resumen.metrics);
        setPedidos(resumen.pedidos);
        setVentasMensuales(resumen.ventasMensuales);
      })
      .catch(() => {
        setMetrics(METRICS_VACIAS);
        setPedidos([]);
        setVentasMensuales([]);
      });
  }, []);

  // El valor más alto, para escalar las barras (mínimo 1 para no dividir por cero)
  const maxVenta = Math.max(1, ...ventasMensuales.map((v) => v.ventas));

  const topProductos = [...productos]
    .sort((a, b) => b.precio * (b.stock || 1) - a.precio * (a.stock || 1))
    .slice(0, 5);

  const ventasValidas = pedidos.filter((p) => !['RECHAZADO', 'CANCELADO'].includes(p.estado));
  const ingresosTotales = ventasValidas.reduce((acc, p) => acc + p.total, 0);
  const ticketPromedio = ventasValidas.length ? ingresosTotales / ventasValidas.length : 0;

  const kpis = [
    { label: 'Ingresos totales', value: `$${ingresosTotales.toFixed(0)}`, sub: 'Acumulado (ventas válidas)', icon: DollarSign },
    { label: 'Pedidos totales', value: metrics.totalPedidos, sub: 'Registrados en el sistema', icon: ShoppingBag },
    { label: 'Clientes activos', value: metrics.clientesActivos, sub: 'Sin suspensión', icon: Users },
    { label: 'Ticket promedio', value: `$${ticketPromedio.toFixed(2)}`, sub: 'Por pedido', icon: TrendingUp },
  ];

  return (
    <div className="flex h-full bg-[#fafafa] font-sans w-full">
      <AdminSidebar />
      <main className="flex-1 ml-64 h-screen overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Analíticas</h1>
            <p className="text-gray-500 text-sm">Resumen de rendimiento, ventas y clientes del negocio.</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-600 font-bold text-sm">{kpi.label}</h3>
                    <div className="w-8 h-8 rounded bg-[#e6fff7] flex items-center justify-center text-[#00c98a]">
                      <Icon size={18} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{kpi.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Gráfico de ventas mensuales */}
            <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Ventas mensuales</h2>
              <div className="flex items-end gap-4 h-40">
                {ventasMensuales.map((v) => {
                  const height = Math.round((v.ventas / maxVenta) * 100);
                  return (
                    <div key={v.mes} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">${Math.round(v.ventas)}</span>
                      <div
                        className="w-full rounded-t-md bg-[#00e69e] transition-all"
                        style={{ height: `${height}%`, minHeight: v.ventas > 0 ? '4px' : '0' }}
                      />
                      <span className="text-xs font-semibold text-gray-400">{v.mes}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top productos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Top productos</h2>
              <ul className="space-y-3">
                {topProductos.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#e6fff7] text-[#00c98a] text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 flex-1 truncate">{p.nombre}</span>
                    <span className="text-sm font-bold text-gray-900">${p.precio}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Categorías */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Distribución por categoría</h2>
            <div className="space-y-3">
              {[...new Set(productos.map((p) => p.categoria))].map((cat) => {
                const count = productos.filter((p) => p.categoria === cat).length;
                const pct = Math.round((count / productos.length) * 100);
                return (
                  <div key={cat} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">{cat}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#00e69e] h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-10 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnaliticas;
