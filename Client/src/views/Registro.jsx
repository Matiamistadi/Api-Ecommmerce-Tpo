import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Registro.css';

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
    navigate('/login');
  };

  return (
    <div className="registro">
      <div className="registro__form-panel">
        <p className="registro__brand">GymStore</p>
        <h1 className="registro__title">Crear Cuenta</h1>
        <p className="registro__subtitle">
          Equipamiento de grado profesional para atletas que exigen lo mejor.
        </p>

        <form onSubmit={handleSubmit} className="registro__form" noValidate>
          <div className="registro__field">
            <label htmlFor="nombre" className="registro__label">Nombre Completo</label>
            <input
              id="nombre" name="nombre" type="text"
              className="registro__input" placeholder="Tu nombre"
              value={form.nombre} onChange={handleChange}
            />
          </div>

          <div className="registro__field">
            <label htmlFor="email" className="registro__label">Correo Electrónico</label>
            <input
              id="email" name="email" type="email"
              className="registro__input" placeholder="athlete@example.com"
              value={form.email} onChange={handleChange}
            />
          </div>

          <div className="registro__field">
            <label htmlFor="password" className="registro__label">Contraseña</label>
            <input
              id="password" name="password" type="password"
              className="registro__input" placeholder="Mínimo 6 caracteres"
              value={form.password} onChange={handleChange}
            />
          </div>

          <div className="registro__field">
            <label htmlFor="confirmar" className="registro__label">Confirmar Contraseña</label>
            <input
              id="confirmar" name="confirmar" type="password"
              className="registro__input" placeholder="Repetí tu contraseña"
              value={form.confirmar} onChange={handleChange}
            />
          </div>

          {error && <p className="registro__error">{error}</p>}

          <button type="submit" className="registro__submit">REGISTRARSE →</button>
        </form>

        <p className="registro__footer">
          ¿Ya tenés una cuenta?{' '}
          <Link to="/login" className="registro__link">Iniciá sesión</Link>
        </p>
      </div>

      <div className="registro__hero">
        <div className="registro__hero-content">
          <div className="registro__hero-icon">⚡</div>
          <h2 className="registro__hero-title">Rendimiento<br />sin límites</h2>
          <p className="registro__hero-text">
            Accedé a los mejores suplementos de performance, historial de pedidos y ofertas exclusivas para atletas.
          </p>
          <ul className="registro__hero-list">
            <li>✓ Envío rápido a todo el país</li>
            <li>✓ Productos 100% originales</li>
            <li>✓ Soporte especializado 24/7</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Registro;
