import { Link } from 'react-router-dom';
import './AgregarDireccion.css';

const campos = [
  { name: 'calle', label: 'Calle', placeholder: 'Av. Corrientes' },
  { name: 'numero', label: 'Número', placeholder: '1234' },
  { name: 'piso', label: 'Piso / Departamento', placeholder: '8B' },
  { name: 'ciudad', label: 'Ciudad', placeholder: 'Buenos Aires' },
  { name: 'provincia', label: 'Provincia', placeholder: 'CABA' },
  { name: 'codigoPostal', label: 'Código postal', placeholder: '1043' },
];

const AgregarDireccion = () => {
  return (
    <main className="agregar-direccion">
      <section className="agregar-direccion__shell">
        <aside className="agregar-direccion__panel">
          <p className="agregar-direccion__eyebrow">Direcciones</p>
          <h1 className="agregar-direccion__titulo">Agregar dirección</h1>
          <p className="agregar-direccion__texto">
            Completá tus datos para agilizar entregas y dejar la dirección lista para compras futuras.
          </p>

          <div className="agregar-direccion__hint">
            <strong>Uso recomendado</strong>
            <span>Guardá una dirección principal y otra de trabajo si necesitás recibir pedidos en distintos lugares.</span>
          </div>

          <Link to="/perfil" className="agregar-direccion__link">Volver a mi cuenta</Link>
        </aside>

        <section className="agregar-direccion__card">
          <form className="agregar-direccion__form">
            <div className="agregar-direccion__grid">
              {campos.map((campo) => (
                <label key={campo.name} className="agregar-direccion__field">
                  <span>{campo.label}</span>
                  <input type="text" placeholder={campo.placeholder} />
                </label>
              ))}
            </div>

            <label className="agregar-direccion__field agregar-direccion__field--full">
              <span>Referencia adicional</span>
              <textarea rows="4" placeholder="Entre calles, timbre, portón, o indicaciones para la entrega" />
            </label>

            <div className="agregar-direccion__actions">
              <Link to="/perfil" className="agregar-direccion__btn agregar-direccion__btn--secondary">Cancelar</Link>
              <button type="button" className="agregar-direccion__btn agregar-direccion__btn--primary">Guardar dirección</button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
};

export default AgregarDireccion;