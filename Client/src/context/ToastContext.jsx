import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import './ToastContext.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null); // { mensaje, tipo }

  // mostrarToast('Texto') o mostrarToast('Error...', 'error')
  const mostrarToast = useCallback((mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo, id: Date.now() });
  }, []);

  // Se cierra solo a los 3.5s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      {toast && (
        <div className={`toast toast--${toast.tipo}`} role="status">
          {toast.tipo === 'error'
            ? <AlertCircle size={20} className="toast__icon" />
            : <CheckCircle2 size={20} className="toast__icon" />}
          <p className="toast__mensaje">{toast.mensaje}</p>
          <button className="toast__close" onClick={() => setToast(null)} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- patrón estándar Context+hook: solo afecta el fast refresh en dev, no es un bug
export const useToast = () => useContext(ToastContext);
