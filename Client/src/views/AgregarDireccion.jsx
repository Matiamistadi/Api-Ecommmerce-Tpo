import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUsuario } from '../redux/features/authSlice';
import { crearDireccion } from '../redux/features/direccionesSlice';
import { useToast } from '../context/ToastContext';
import './AgregarDireccion.css';

const initialForm = {
  calle: '',
  numero: '',
  piso: '',
  ciudad: '',
  provincia: '',
  codigoPostal: '',
  referencia: '',
};

const AgregarDireccion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const usuario = useSelector(selectUsuario);
  const { mostrarToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [guardando, setGuardando] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const guardar = async () => {
    if (!form.calle || !form.numero || !form.ciudad || !form.codigoPostal) {
      mostrarToast('Completá calle, número, ciudad y código postal.', 'error');
      return;
    }
    if (!usuario) {
      navigate('/login');
      return;
    }

    setGuardando(true);
    try {
      // El backend guarda la calle completa (juntamos calle + número + piso)
      await dispatch(crearDireccion({
        usuarioId: usuario.id,
        direccion: {
          calle: `${form.calle} ${form.numero}${form.piso ? `, ${form.piso}` : ''}`.trim(),
          ciudad: form.ciudad,
          provincia: form.provincia,
          codigoPostal: form.codigoPostal,
          esPrincipal: false,
        },
      })).unwrap();
      mostrarToast('Dirección guardada.');
      navigate('/perfil');
    } catch (err) {
      mostrarToast(err.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="agregar-direccion">
      <section className="agregar-direccion__shell">
        <aside className="agregar-direccion__panel">
          <p className="agregar-direccion__eyebrow">Direcciones</p>
          <h1 className="agregar-direccion__titulo">Agregar dirección</h1>
          <p className="agregar-direccion__texto">
            Completá los datos para dejar la dirección disponible en checkout y en tu perfil.
          </p>

          <div className="agregar-direccion__hint">
            <strong>Uso recomendado</strong>
            <span>Guardá una dirección principal y otra de trabajo si necesitás recibir pedidos en distintos lugares.</span>
          </div>

          <Link to="/perfil" className="agregar-direccion__link">Volver a mi cuenta</Link>
        </aside>

        <section className="agregar-direccion__card">
          <form className="agregar-direccion__form" onSubmit={(event) => event.preventDefault()}>
            <div className="agregar-direccion__grid">
              {[
                { name: 'calle', label: 'Calle', placeholder: 'Av. Corrientes' },
                { name: 'numero', label: 'Número', placeholder: '1234' },
                { name: 'piso', label: 'Piso / Departamento', placeholder: '8B' },
                { name: 'ciudad', label: 'Ciudad', placeholder: 'Buenos Aires' },
                { name: 'provincia', label: 'Provincia', placeholder: 'CABA' },
                { name: 'codigoPostal', label: 'Código postal', placeholder: '1043' },
              ].map((campo) => (
                <label key={campo.name} className="agregar-direccion__field">
                  <span>{campo.label}</span>
                  <input name={campo.name} type="text" value={form[campo.name]} onChange={handleChange} placeholder={campo.placeholder} />
                </label>
              ))}
            </div>

            <label className="agregar-direccion__field agregar-direccion__field--full">
              <span>Referencia adicional</span>
              <textarea
                name="referencia"
                rows="4"
                value={form.referencia}
                onChange={handleChange}
                placeholder="Entre calles, timbre, portón, o indicaciones para la entrega"
              />
            </label>

            <div className="agregar-direccion__actions">
              <Link to="/perfil" className="agregar-direccion__btn agregar-direccion__btn--secondary">Cancelar</Link>
              <button type="button" className="agregar-direccion__btn agregar-direccion__btn--primary" onClick={guardar} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar dirección'}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
};

export default AgregarDireccion;
