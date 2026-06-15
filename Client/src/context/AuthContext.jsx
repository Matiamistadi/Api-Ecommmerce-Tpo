import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Al iniciar la app, recuperamos la sesión guardada en localStorage (si existe)
  const [usuario, setUsuario] = useState(authService.getSesionGuardada());

  const login = async (email, password) => {
    const sesion = await authService.login(email, password);
    setUsuario(sesion);
    return sesion;
  };

  const register = async (email, password) => {
    const sesion = await authService.register(email, password);
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
