import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor completá todos los campos.');
      return;
    }

    if (!email.includes('@')) {
      setError('Ingresá un email válido.');
      return;
    }

    // Placeholder: cuando conectemos al backend, esto será una llamada a POST /api/auth/login
    console.log('Login intentado:', { email, password });
    setError('');
    alert(`Bienvenido ${email}! (login simulado, aún no conectado al backend)`);
  };

  return (
    <div className="login">
      <div className="login__card">
        <p className="login__brand">GymStore</p>
        <h1 className="login__title">Bienvenido de Nuevo</h1>
        <p className="login__subtitle">
          Inicia sesión para acceder a tu panel y continuar tu camino.
        </p>

        <form onSubmit={handleSubmit} className="login__form" noValidate>
          <div className="login__field">
            <label htmlFor="email" className="login__label">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              className="login__input"
              placeholder="athlete@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login__field">
            <label htmlFor="password" className="login__label">Contraseña</label>
            <input
              id="password"
              type="password"
              className="login__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="login__error">{error}</p>}

          <button type="submit" className="login__submit">INICIAR SESIÓN →</button>
        </form>

        <p className="login__footer">
          ¿No tienes una cuenta? <Link to="/registro" className="login__link">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
