import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_URL } from '../services/api';
import './Login.css';

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Ingresá un email válido.');
      return;
    }
    setCargando(true);
    setError('');
    try {
      await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setEnviado(true);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login">
      <div className="login__form-panel">
        <div className="login__brand">GymStore</div>
        <h1 className="login__title">Recuperar contraseña</h1>

        {enviado ? (
          <div style={{ textAlign: 'center' }}>
            <p className="login__subtitle">
              Si ese email está registrado, te enviamos un código para restablecer tu contraseña.
            </p>
            <Link to="/reset-password" className="login__link">Tengo un código →</Link>
          </div>
        ) : (
          <>
            <p className="login__subtitle">
              Ingresá tu email y te mandamos un código de recuperación.
            </p>
            <form onSubmit={handleSubmit} className="login__form" noValidate>
              <div className="login__field">
                <Label htmlFor="email" className="login__label">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  className="login__input h-auto"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <span className="login__field-error">{error}</span>}
              </div>
              <Button type="submit" className="login__submit h-auto w-full" disabled={cargando}>
                {cargando ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
              </Button>
            </form>
          </>
        )}

        <p className="login__footer" style={{ marginTop: '1.5rem' }}>
          <Link to="/login" className="login__link"><ArrowLeft size={14} style={{ display: 'inline' }} /> Volver al login</Link>
        </p>
      </div>
    </div>
  );
};

export default OlvidePassword;
