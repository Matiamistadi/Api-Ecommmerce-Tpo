import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_URL } from '../services/api';
import { useToast } from '../context/ToastContext';
import './Login.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const [form, setForm] = useState({ token: '', nuevaPassword: '', confirmar: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.token) { setError('Ingresá el código recibido por email.'); return; }
    if (form.nuevaPassword.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (form.nuevaPassword !== form.confirmar) { setError('Las contraseñas no coinciden.'); return; }

    setCargando(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: form.token, nuevaPassword: form.nuevaPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.mensaje || 'Token inválido o expirado');
      }
      mostrarToast('Contraseña actualizada. Ya podés iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login">
      <div className="login__form-panel">
        <div className="login__brand">GymStore</div>
        <h1 className="login__title">Nueva contraseña</h1>
        <p className="login__subtitle">Pegá el código que recibiste por email y elegí una nueva contraseña.</p>

        <form onSubmit={handleSubmit} className="login__form" noValidate>
          <div className="login__field">
            <Label className="login__label">Código de recuperación</Label>
            <Input
              type="text"
              className="login__input h-auto"
              placeholder="Pegá el código del email"
              value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })}
            />
          </div>
          <div className="login__field">
            <Label className="login__label">Nueva contraseña</Label>
            <Input
              type="password"
              className="login__input h-auto"
              placeholder="Mínimo 8 caracteres"
              value={form.nuevaPassword}
              onChange={(e) => setForm({ ...form, nuevaPassword: e.target.value })}
            />
          </div>
          <div className="login__field">
            <Label className="login__label">Confirmar contraseña</Label>
            <Input
              type="password"
              className="login__input h-auto"
              placeholder="••••••••"
              value={form.confirmar}
              onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
            />
          </div>
          {error && <span className="login__field-error">{error}</span>}
          <Button type="submit" className="login__submit h-auto w-full" disabled={cargando}>
            {cargando ? 'GUARDANDO...' : 'CAMBIAR CONTRASEÑA'}
          </Button>
        </form>

        <p className="login__footer" style={{ marginTop: '1.5rem' }}>
          <Link to="/login" className="login__link"><ArrowLeft size={14} style={{ display: 'inline' }} /> Volver al login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
