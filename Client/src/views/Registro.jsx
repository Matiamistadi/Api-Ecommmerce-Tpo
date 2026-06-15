import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Registro.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';

const Registro = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validarTodo = () => {
    const e = {};
    if (!form.nombre) {
      e.nombre = 'Ingresá tu nombre completo.';
    }
    if (!form.email || !form.email.includes('@')) {
      e.email = 'Ingresá un correo electrónico válido.';
    }
    if (!form.password) {
      e.password = 'Ingresá tu contraseña.';
    } else if (form.password.length < 6) {
      e.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (!form.confirmar) {
      e.confirmar = 'Confirmá tu contraseña.';
    } else if (form.password !== form.confirmar) {
      e.confirmar = 'Las contraseñas no coinciden.';
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarTodo()) {
      return;
    }

    setCargando(true);
    try {
      // El backend solo necesita email y password (el nombre es solo del front).
      // register() crea el usuario y ya devuelve el token, así que queda logueado.
      await register(form.email, form.password);
      setErrores({});
      navigate('/perfil');
    } catch (err) {
      setErrores({ general: err.message });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro">
      <div className="registro__form-panel">
        <div className="registro__brand">GymStore</div>
        <h1 className="registro__title">Crear cuenta</h1>
        <p className="registro__subtitle">
          Únete para acceder a ofertas exclusivas y rutinas de rendimiento.
        </p>

        <form onSubmit={handleSubmit} className="registro__form" noValidate>
          <div className="registro__field">
            <Label htmlFor="nombre" className="registro__label">Nombre completo</Label>
            <Input
              id="nombre" name="nombre" type="text"
              className={`registro__input h-auto ${errores.nombre ? 'registro__input--error' : ''}`}
              placeholder="Juan Pérez"
              value={form.nombre} onChange={handleChange}
            />
            {errores.nombre && <span className="registro__field-error">{errores.nombre}</span>}
          </div>

          <div className="registro__field">
            <Label htmlFor="email" className="registro__label">Correo electrónico</Label>
            <Input
              id="email" name="email" type="email"
              className={`registro__input h-auto ${errores.email ? 'registro__input--error' : ''}`}
              placeholder="juan@ejemplo.com"
              value={form.email} onChange={handleChange}
            />
            {errores.email && <span className="registro__field-error">{errores.email}</span>}
          </div>

          <div className="registro__field">
            <Label htmlFor="password" className="registro__label">Contraseña</Label>
            <Input
              id="password" name="password" type="password"
              className={`registro__input h-auto ${errores.password ? 'registro__input--error' : ''}`}
              placeholder="••••••••"
              value={form.password} onChange={handleChange}
            />
            {errores.password && <span className="registro__field-error">{errores.password}</span>}
          </div>

          <div className="registro__field">
            <Label htmlFor="confirmar" className="registro__label">Confirmar contraseña</Label>
            <Input
              id="confirmar" name="confirmar" type="password"
              className={`registro__input h-auto ${errores.confirmar ? 'registro__input--error' : ''}`}
              placeholder="••••••••"
              value={form.confirmar} onChange={handleChange}
            />
            {errores.confirmar && <span className="registro__field-error">{errores.confirmar}</span>}
          </div>

          {errores.general && <span className="registro__field-error">{errores.general}</span>}

          <Button type="submit" className="registro__submit h-auto w-full" disabled={cargando}>
            {cargando ? 'CREANDO CUENTA...' : <>REGISTRARSE <ArrowRight size={18} /></>}
          </Button>
        </form>

        <p className="registro__footer">
          Ya tengo una cuenta. <Link to="/login" className="registro__link">Iniciar sesión</Link>
        </p>
      </div>

      {/* <div className="registro__hero">
        <div className="registro__hero-image"></div>
        <div className="registro__hero-overlay"></div>
        <div className="registro__hero-content">
          <div className="registro__hero-badge">
            <Dumbbell size={24} className="text-gym-primary" />
          </div>
          <h2 className="registro__hero-title">Rendimiento sin límites.</h2>
          <p className="registro__hero-text">
            Equipamiento de grado profesional para atletas que exigen lo mejor en cada entrenamiento.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Registro;
