import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Al iniciar la app, recuperamos la sesión guardada en localStorage (si existe y no venció)
  const [usuario, setUsuario] = useState(authService.getSesionGuardada());

  // Si una petición detecta el token vencido (401), nos deslogueamos automáticamente
  useEffect(() => {
    const onExpirada = () => setUsuario(null);
    window.addEventListener('sesion-expirada', onExpirada);
    return () => window.removeEventListener('sesion-expirada', onExpirada);
  }, []);

  const login = async (email, password) => {
    const sesion = await authService.login(email, password);
    setUsuario(sesion);
    return sesion;
  };

  const register = async (email, password, nombre) => {
    const sesion = await authService.register(email, password, nombre);
    setUsuario(sesion);
    return sesion;
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaLogueado: !!usuario,
        esAdmin: usuario?.rol === 'ADMIN',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
