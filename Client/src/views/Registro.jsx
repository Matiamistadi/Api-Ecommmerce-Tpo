import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight } from 'lucide-react';
import './Registro.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.password || !form.confirmar) {
      setError('Por favor completá todos los campos.');
      return;
    }
    if (!form.email.includes('@')) {
      setError('Ingresá un email válido.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    alert(`¡Cuenta creada con éxito! Bienvenido, ${form.nombre}.`);
    navigate('/login');
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
              className="registro__input h-auto" placeholder="Juan Pérez"
              value={form.nombre} onChange={handleChange}
            />
          </div>

          <div className="registro__field">
            <Label htmlFor="email" className="registro__label">Correo electrónico</Label>
            <Input
              id="email" name="email" type="email"
              className="registro__input h-auto" placeholder="juan@ejemplo.com"
              value={form.email} onChange={handleChange}
            />
          </div>

          <div className="registro__field">
            <Label htmlFor="password" className="registro__label">Contraseña</Label>
            <Input
              id="password" name="password" type="password"
              className="registro__input h-auto" placeholder="••••••••"
              value={form.password} onChange={handleChange}
            />
          </div>

          <div className="registro__field">
            <Label htmlFor="confirmar" className="registro__label">Confirmar contraseña</Label>
            <Input
              id="confirmar" name="confirmar" type="password"
              className="registro__input h-auto" placeholder="••••••••"
              value={form.confirmar} onChange={handleChange}
            />
          </div>

          {error && <p className="registro__error">{error}</p>}

          <Button type="submit" className="registro__submit h-auto w-full">
            REGISTRARSE <ArrowRight size={18} />
          </Button>
        </form>

        <p className="registro__footer">
          Ya tengo una cuenta. <Link to="/login" className="registro__link">Iniciar sesión</Link>
        </p>
      </div>

      <div className="registro__hero">
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
      </div>
    </div>
  );
};

export default Registro;
