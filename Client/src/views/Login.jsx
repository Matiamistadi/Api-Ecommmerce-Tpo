import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import './Login.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});

  const validarTodo = () => {
    const e = {};
    if (!email || !email.includes('@')) {
      e.email = 'Ingresá un correo electrónico válido.';
    }
    if (!password) {
      e.password = 'Ingresá tu contraseña.';
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarTodo()) {
      return;
    }

    console.log('Login intentado:', { email, password });
    setErrores({});
    navigate('/perfil');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setEmail('admin@gymstore.com');
    setPassword('admin123');
    alert('Ingresando como Administrador (Credenciales simuladas)');
    navigate('/admin');
  };

  return (
    <div className="login">
      <div className="login__form-panel">
        <div className="login__brand">GymStore</div>
        <h1 className="login__title">Bienvenido de Nuevo</h1>
        <p className="login__subtitle">
          Inicia sesión para acceder a tu panel y continuar tu camino.
        </p>

        <form onSubmit={handleSubmit} className="login__form" noValidate>
          <div className="login__field">
            <Label htmlFor="email" className="login__label">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              className={`login__input h-auto ${errores.email ? 'login__input--error' : ''}`}
              placeholder="athlete@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errores.email && <span className="login__field-error">{errores.email}</span>}
          </div>

          <div className="login__field">
            <div className="login__label-row">
              <Label htmlFor="password" className="login__label">Contraseña</Label>
              <a href="#forgot" className="login__forgot" onClick={(e) => { e.preventDefault(); alert('Función de recuperación de contraseña simulada.'); }}>¿Olvidaste tu contraseña?</a>
            </div>
            <Input
              id="password"
              type="password"
              className={`login__input h-auto ${errores.password ? 'login__input--error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errores.password && <span className="login__field-error">{errores.password}</span>}
          </div>

          <Button type="submit" className="login__submit h-auto w-full">
            INICIAR SESIÓN <ArrowRight size={18} />
          </Button>
          
          <Button type="button" onClick={handleAdminLogin} className="login__admin-submit h-auto w-full">
            Iniciar como Administrador <Lock size={16} />
          </Button>
        </form>

        <p className="login__footer">
          ¿No tienes una cuenta? <Link to="/registro" className="login__link">Regístrate</Link>
        </p>

        <div className="login__meta">
          <span className="login__meta-item">
            <ShieldCheck size={16} className="text-gym-accent" /> Seguro
          </span>
          <span className="login__meta-item">
            <Zap size={16} className="text-gym-accent" /> Rápido
          </span>
        </div>
      </div>

    </div>
  );
};

export default Login;
