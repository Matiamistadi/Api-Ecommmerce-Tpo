import { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Store, Truck, Bell, Lock } from 'lucide-react';

const AdminAjustes = () => {
  const [tienda, setTienda] = useState({
    nombre: 'GymStore',
    descripcion: 'Tu tienda de suplementos y equipamiento deportivo.',
    email: 'contacto@gymstore.com',
    telefono: '+54 11 0000-0000',
  });

  const [envio, setEnvio] = useState({
    costoBase: '500',
    minimoGratis: '5000',
    zonas: 'Nacional',
  });

  const [notificaciones, setNotificaciones] = useState({
    stockBajo: true,
    nuevosPedidos: true,
    clientesNuevos: false,
  });

  const [cuenta, setCuenta] = useState({
    emailAdmin: 'admin@gymstore.com',
    passwordActual: '',
    passwordNuevo: '',
  });

  const handleTiendaChange = (e) => {
    const { name, value } = e.target;
    setTienda((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnvioChange = (e) => {
    const { name, value } = e.target;
    setEnvio((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotifToggle = (key) => {
    setNotificaciones((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCuentaChange = (e) => {
    const { name, value } = e.target;
    setCuenta((prev) => ({ ...prev, [name]: value }));
  };

  const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium';
  const sectionCls = 'bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6';
  const labelCls = 'block text-sm font-bold text-gray-900 mb-2';

  return (
    <div className="flex h-full bg-[#fafafa] font-sans w-full">
      <AdminSidebar />
      <main className="flex-1 ml-64 h-screen overflow-y-auto">
        <div className="p-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Ajustes</h1>
            <p className="text-gray-500 text-sm">Configuración general de la tienda y la cuenta de administración.</p>
          </div>

          {/* Datos de la tienda */}
          <div className={sectionCls}>
            <div className="flex items-center gap-2 mb-6">
              <Store size={20} className="text-[#00c98a]" />
              <h2 className="text-lg font-bold text-gray-900">Datos de la tienda</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nombre de la tienda</label>
                <input type="text" name="nombre" value={tienda.nombre} onChange={handleTiendaChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea name="descripcion" rows={3} value={tienda.descripcion} onChange={handleTiendaChange} className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email de contacto</label>
                  <input type="email" name="email" value={tienda.email} onChange={handleTiendaChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input type="tel" name="telefono" value={tienda.telefono} onChange={handleTiendaChange} className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Datos de la tienda guardados.')}
                  className="bg-[#00e69e] hover:bg-[#00c98a] text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>

          {/* Configuración de envíos */}
          <div className={sectionCls}>
            <div className="flex items-center gap-2 mb-6">
              <Truck size={20} className="text-[#00c98a]" />
              <h2 className="text-lg font-bold text-gray-900">Envíos</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Costo base de envío ($)</label>
                  <input type="number" name="costoBase" value={envio.costoBase} onChange={handleEnvioChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mínimo para envío gratis ($)</label>
                  <input type="number" name="minimoGratis" value={envio.minimoGratis} onChange={handleEnvioChange} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Zonas de cobertura</label>
                <select name="zonas" value={envio.zonas} onChange={handleEnvioChange} className={inputCls}>
                  <option>Nacional</option>
                  <option>AMBA</option>
                  <option>Capital Federal</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Configuración de envíos guardada.')}
                  className="bg-[#00e69e] hover:bg-[#00c98a] text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className={sectionCls}>
            <div className="flex items-center gap-2 mb-6">
              <Bell size={20} className="text-[#00c98a]" />
              <h2 className="text-lg font-bold text-gray-900">Notificaciones</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: 'stockBajo', label: 'Alertas de stock bajo', desc: 'Recibir aviso cuando un producto tenga menos de 15 unidades.' },
                { key: 'nuevosPedidos', label: 'Nuevos pedidos', desc: 'Recibir aviso cuando llegue un nuevo pedido.' },
                { key: 'clientesNuevos', label: 'Clientes nuevos', desc: 'Recibir aviso cuando un cliente se registre.' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotifToggle(key)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notificaciones[key] ? 'bg-[#00e69e]' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notificaciones[key] ? 'left-6' : 'left-1'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cuenta del admin */}
          <div className={sectionCls}>
            <div className="flex items-center gap-2 mb-6">
              <Lock size={20} className="text-[#00c98a]" />
              <h2 className="text-lg font-bold text-gray-900">Cuenta de administración</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Email del administrador</label>
                <input type="email" name="emailAdmin" value={cuenta.emailAdmin} onChange={handleCuentaChange} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Contraseña actual</label>
                  <input type="password" name="passwordActual" value={cuenta.passwordActual} onChange={handleCuentaChange} placeholder="••••••••" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Nueva contraseña</label>
                  <input type="password" name="passwordNuevo" value={cuenta.passwordNuevo} onChange={handleCuentaChange} placeholder="••••••••" className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Contraseña actualizada.')}
                  className="bg-[#00e69e] hover:bg-[#00c98a] text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  Actualizar contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAjustes;
