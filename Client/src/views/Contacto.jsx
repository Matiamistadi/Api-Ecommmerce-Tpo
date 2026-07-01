import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getConfiguracion } from '../services/configuracionService';
import { apiFetch } from '../services/api';
import './InfoPage.css';

const Contacto = () => {
  const { mostrarToast } = useToast();
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const [contacto, setContacto] = useState({ email: 'contacto@gymstore.com', telefono: '+54 11 5555-0000' });
  const enviado = useRef(false);

  useEffect(() => {
    getConfiguracion()
      .then((config) => setContacto({
        email: config.emailContacto || 'contacto@gymstore.com',
        telefono: config.telefono || '+54 11 5555-0000',
      }))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      mostrarToast('Completá todos los campos.', 'error');
      return;
    }
    setEnviando(true);
    try {
      await apiFetch('/api/contacto', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      enviado.current = true;
      setForm({ nombre: '', email: '', mensaje: '' });
      mostrarToast('¡Mensaje enviado! Te responderemos a la brevedad.');
    } catch (err) {
      mostrarToast(err.message || 'No se pudo enviar el mensaje.', 'error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="info-page">
      <p className="info-page__eyebrow">Contacto</p>
      <h1 className="info-page__title">Hablemos</h1>
      <p className="info-page__subtitle">
        ¿Tenés una duda sobre un producto o tu pedido? Escribinos y te respondemos lo antes posible.
      </p>

      <div className="contacto__layout">
        <div>
          <div className="contacto__info-item">
            <Mail className="contacto__info-icon" size={20} />
            <div>
              <strong>Email</strong>
              <span>{contacto.email}</span>
            </div>
          </div>
          <div className="contacto__info-item">
            <Phone className="contacto__info-icon" size={20} />
            <div>
              <strong>Teléfono</strong>
              <span>{contacto.telefono}</span>
            </div>
          </div>
          <div className="contacto__info-item">
            <MapPin className="contacto__info-icon" size={20} />
            <div>
              <strong>Local</strong>
              <span>Av. Corrientes 1234, CABA</span>
            </div>
          </div>
        </div>

        <form className="contacto__form" onSubmit={handleSubmit} noValidate>
          <div className="contacto__field">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" />
          </div>
          <div className="contacto__field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
          </div>
          <div className="contacto__field">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea id="mensaje" name="mensaje" rows={5} value={form.mensaje} onChange={handleChange} placeholder="¿En qué te podemos ayudar?" />
          </div>
          <button type="submit" className="contacto__submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contacto;
