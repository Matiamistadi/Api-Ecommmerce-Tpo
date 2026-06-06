import { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Store, Truck, Bell, Lock, CheckCircle2, X, AlertTriangle } from 'lucide-react';

const NOTIF_CONFIG = [
  {
    key: 'stockBajo',
    label: 'Alertas de stock bajo',
    desc: 'Recibir aviso cuando un producto tenga menos de 15 unidades.',
    mensaje: 'Recibirás una notificación cuando un producto tenga stock bajo.',
  },
  {
    key: 'nuevosPedidos',
    label: 'Nuevos pedidos',
    desc: 'Recibir aviso cuando llegue un nuevo pedido.',
    mensaje: 'Recibirás una notificación cuando llegue un nuevo pedido.',
  },
  {
    key: 'clientesNuevos',
    label: 'Clientes nuevos',
    desc: 'Recibir aviso cuando un cliente se registre.',
    mensaje: 'Recibirás una notificación cuando se registre un nuevo cliente.',
  },
];

const AdminAjustes = () => {
  const [tienda, setTienda] = useState({
    nombre: 'GymStore',
    descripcion: 'Tu tienda de suplementos y equipamiento deportivo.',
    email: 'contacto@gymstore.com',
    telefono: '+54 11 0000-0000',
  });

  const [envio, setEnvio] = useState({
    costoBase: '9.99',
    minimoGratis: '89.99',
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
    passwordConfirm: '',
  });
  const [erroresCuenta, setErroresCuenta] = useState({});
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleTiendaChange = (e) => {
    const { name, value } = e.target;
    setTienda((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnvioChange = (e) => {
    const { name, value } = e.target;
    setEnvio((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotifToggle = (key) => {
    const activando = !notificaciones[key];
    setNotificaciones((prev) => ({ ...prev, [key]: activando }));
    if (activando) {
      const config = NOTIF_CONFIG.find((n) => n.key === key);
      setToast({ mensaje: config.mensaje });
    } else {
      setToast(null);
    }
  };

  const handleCuentaChange = (e) => {
    const { name, value } = e.target;
    setCuenta((prev) => ({ ...prev, [name]: value }));
    setErroresCuenta((prev) => ({ ...prev, [name]: undefined }));
  };

  const validarCuenta = () => {
    const errores = {};
    if (!cuenta.passwordActual.trim()) {
      errores.passwordActual = 'Ingresá tu contraseña actual.';
    }
    if (!cuenta.passwordNuevo.trim()) {
      errores.passwordNuevo = 'Ingresá la nueva contraseña.';
    } else if (cuenta.passwordNuevo.length < 8) {
      errores.passwordNuevo = 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!cuenta.passwordConfirm.trim()) {
      errores.passwordConfirm = 'Confirmá la nueva contraseña.';
    } else if (cuenta.passwordNuevo !== cuenta.passwordConfirm) {
      errores.passwordConfirm = 'Las contraseñas no coinciden.';
    }
    return errores;
  };

  const handleGuardarCuentaClick = () => {
    const errores = validarCuenta();
    if (Object.keys(errores).length > 0) {
      setErroresCuenta(errores);
      return;
    }
    setErroresCuenta({});
    setMostrarConfirmPassword(true);
  };

  const confirmarCambioPassword = () => {
    setMostrarConfirmPassword(false);
    setCuenta((prev) => ({ ...prev, passwordActual: '', passwordNuevo: '', passwordConfirm: '' }));
    setToast({ mensaje: 'Contraseña actualizada correctamente.' });
  };

  const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium';
  const inputErrCls = 'w-full px-4 py-3 bg-gray-50 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-300 outline-none font-medium';
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
                  onClick={() => setToast({ mensaje: 'Datos de la tienda guardados.' })}
                  className="bg-[#00e69e] hover:bg-[#00c98a] text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>

          {/* Envíos */}
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
                  onClick={() => setToast({ mensaje: 'Configuración de envíos guardada.' })}
                  className="bg-[#00e69e] hover:bg-[#00c98a] text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className={sectionCls}>
            <div className="flex items-center gap-2 mb-2">
              <Bell size={20} className="text-[#00c98a]" />
              <h2 className="text-lg font-bold text-gray-900">Notificaciones</h2>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Las alertas se enviarán al correo <span className="font-semibold text-gray-700">{tienda.email}</span>.
            </p>
            <div className="space-y-4">
              {NOTIF_CONFIG.map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotifToggle(key)}
                    aria-label={notificaciones[key] ? `Desactivar ${label}` : `Activar ${label}`}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notificaciones[key] ? 'bg-[#00e69e]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notificaciones[key] ? 'left-6' : 'left-1'}`} />
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
                <input
                  type="email"
                  name="emailAdmin"
                  value={cuenta.emailAdmin}
                  onChange={handleCuentaChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Contraseña actual</label>
                <input
                  type="password"
                  name="passwordActual"
                  value={cuenta.passwordActual}
                  onChange={handleCuentaChange}
                  placeholder="••••••••"
                  className={erroresCuenta.passwordActual ? inputErrCls : inputCls}
                />
                {erroresCuenta.passwordActual && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{erroresCuenta.passwordActual}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nueva contraseña</label>
                  <input
                    type="password"
                    name="passwordNuevo"
                    value={cuenta.passwordNuevo}
                    onChange={handleCuentaChange}
                    placeholder="Mínimo 8 caracteres"
                    className={erroresCuenta.passwordNuevo ? inputErrCls : inputCls}
                  />
                  {erroresCuenta.passwordNuevo && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{erroresCuenta.passwordNuevo}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={cuenta.passwordConfirm}
                    onChange={handleCuentaChange}
                    placeholder="••••••••"
                    className={erroresCuenta.passwordConfirm ? inputErrCls : inputCls}
                  />
                  {erroresCuenta.passwordConfirm && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{erroresCuenta.passwordConfirm}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGuardarCuentaClick}
                  className="bg-[#00e69e] hover:bg-[#00c98a] text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  Actualizar contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal confirmación cambio de contraseña */}
      {mostrarConfirmPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 animate-[toast-slide-up_0.2s_ease-out]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-orange-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Confirmar cambio de contraseña</h2>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Estás por modificar la contraseña de la cuenta{' '}
              <span className="font-bold text-gray-900">{cuenta.emailAdmin}</span>.
            </p>
            <p className="text-xs text-orange-500 font-medium mb-6">
              Esta es una acción sensible. Asegurate de recordar tu nueva contraseña.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarConfirmPassword(false)}
                className="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioPassword}
                className="px-5 py-2.5 bg-[#00e69e] hover:bg-[#00c98a] text-black rounded-lg text-sm font-bold transition-colors"
              >
                Confirmar cambio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-white border border-gray-100 shadow-lg rounded-xl px-5 py-4 max-w-sm animate-[toast-slide-up_0.25s_ease-out]">
          <CheckCircle2 size={20} className="text-[#00c98a] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 mb-0.5">Listo</p>
            <p className="text-xs text-gray-500">{toast.mensaje}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAjustes;
