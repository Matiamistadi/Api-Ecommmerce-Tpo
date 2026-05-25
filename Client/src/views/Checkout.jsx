import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const PASOS = ['Identificación', 'Envío', 'Pago'];

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, subtotal, vaciarCarrito } = useCart();
  const [paso, setPaso] = useState(0);
  const [form, setForm] = useState({
    email: '',
    nombre: '', direccion: '', ciudad: '', codigoPostal: '',
    numeroTarjeta: '', fechaVencimiento: '', cvv: '',
  });
  const [errores, setErrores] = useState({});

  const impuestos = subtotal * 0.08;
  const total = subtotal + impuestos;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validarPaso = () => {
    const e = {};
    if (paso === 0 && !form.email.includes('@')) e.email = 'Email inválido';
    if (paso === 1) {
      if (!form.nombre) e.nombre = 'Campo requerido';
      if (!form.direccion) e.direccion = 'Campo requerido';
      if (!form.ciudad) e.ciudad = 'Campo requerido';
      if (!form.codigoPostal) e.codigoPostal = 'Campo requerido';
    }
    if (paso === 2) {
      if (form.numeroTarjeta.replace(/\s/g, '').length < 16) e.numeroTarjeta = 'Número inválido';
      if (!form.fechaVencimiento) e.fechaVencimiento = 'Campo requerido';
      if (form.cvv.length < 3) e.cvv = 'CVV inválido';
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const siguiente = () => { if (validarPaso()) setPaso(p => p + 1); };

  const confirmar = () => {
    if (!validarPaso()) return;
    vaciarCarrito();
    navigate('/confirmacion');
  };

  const formatTarjeta = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  if (carrito.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <main className="checkout">
      <div className="checkout__container">
        <div className="checkout__main">
          {/* Progreso */}
          <div className="checkout__progreso">
            {PASOS.map((label, i) => (
              <div key={i} className={`checkout__paso ${i <= paso ? 'checkout__paso--activo' : ''}`}>
                <div className="checkout__paso-num">{i < paso ? '✓' : i + 1}</div>
                <span className="checkout__paso-label">{label}</span>
                {i < PASOS.length - 1 && <div className="checkout__paso-linea" />}
              </div>
            ))}
          </div>

          {/* Paso 0: Identificación */}
          {paso === 0 && (
            <div className="checkout__seccion">
              <h2 className="checkout__seccion-title">Identificación</h2>
              <div className="checkout__field">
                <label className="checkout__label">Correo Electrónico</label>
                <input
                  name="email"
                  type="email"
                  className={`checkout__input ${errores.email ? 'checkout__input--error' : ''}`}
                  placeholder="athlete@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errores.email && <span className="checkout__field-error">{errores.email}</span>}
              </div>
            </div>
          )}

          {/* Paso 1: Envío */}
          {paso === 1 && (
            <div className="checkout__seccion">
              <h2 className="checkout__seccion-title">Dirección de Envío</h2>
              {[
                { name: 'nombre', label: 'Nombre Completo', placeholder: 'Tu nombre' },
                { name: 'direccion', label: 'Dirección', placeholder: 'Calle y número' },
                { name: 'ciudad', label: 'Ciudad', placeholder: 'Buenos Aires' },
                { name: 'codigoPostal', label: 'Código Postal', placeholder: '1001' },
              ].map(({ name, label, placeholder }) => (
                <div key={name} className="checkout__field">
                  <label className="checkout__label">{label}</label>
                  <input
                    name={name}
                    type="text"
                    className={`checkout__input ${errores[name] ? 'checkout__input--error' : ''}`}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                  />
                  {errores[name] && <span className="checkout__field-error">{errores[name]}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Paso 2: Pago */}
          {paso === 2 && (
            <div className="checkout__seccion">
              <h2 className="checkout__seccion-title">💳 Datos de Pago</h2>
              <div className="checkout__field">
                <label className="checkout__label">Número de Tarjeta</label>
                <input
                  name="numeroTarjeta"
                  type="text"
                  className={`checkout__input ${errores.numeroTarjeta ? 'checkout__input--error' : ''}`}
                  placeholder="0000 0000 0000 0000"
                  value={form.numeroTarjeta}
                  onChange={(e) => setForm({ ...form, numeroTarjeta: formatTarjeta(e.target.value) })}
                  maxLength={19}
                />
                {errores.numeroTarjeta && <span className="checkout__field-error">{errores.numeroTarjeta}</span>}
              </div>
              <div className="checkout__row-2">
                <div className="checkout__field">
                  <label className="checkout__label">Vencimiento (MM/AA)</label>
                  <input
                    name="fechaVencimiento"
                    type="text"
                    className={`checkout__input ${errores.fechaVencimiento ? 'checkout__input--error' : ''}`}
                    placeholder="MM/AA"
                    value={form.fechaVencimiento}
                    onChange={handleChange}
                    maxLength={5}
                  />
                  {errores.fechaVencimiento && <span className="checkout__field-error">{errores.fechaVencimiento}</span>}
                </div>
                <div className="checkout__field">
                  <label className="checkout__label">CVV</label>
                  <input
                    name="cvv"
                    type="password"
                    className={`checkout__input ${errores.cvv ? 'checkout__input--error' : ''}`}
                    placeholder="•••"
                    value={form.cvv}
                    onChange={handleChange}
                    maxLength={4}
                  />
                  {errores.cvv && <span className="checkout__field-error">{errores.cvv}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="checkout__acciones">
            {paso > 0 && (
              <button className="checkout__btn-back" onClick={() => setPaso(p => p - 1)}>
                ← Atrás
              </button>
            )}
            {paso < PASOS.length - 1 ? (
              <button className="checkout__btn-next" onClick={siguiente}>
                Continuar →
              </button>
            ) : (
              <button className="checkout__btn-confirm" onClick={confirmar}>
                🔒 Confirmar pago · ${total.toFixed(2)}
              </button>
            )}
          </div>

          <p className="checkout__seguridad">Transacción segura y encriptada</p>
        </div>

        {/* Sidebar de resumen */}
        <aside className="checkout__sidebar">
          <h3 className="checkout__sidebar-title">Tu Pedido</h3>
          <div className="checkout__sidebar-items">
            {carrito.map(item => (
              <div key={item.id} className="checkout__sidebar-item">
                <img src={item.imagenUrl} alt={item.nombre} className="checkout__sidebar-img" />
                <div className="checkout__sidebar-info">
                  <p className="checkout__sidebar-nombre">{item.nombre}</p>
                  <p className="checkout__sidebar-qty">× {item.cantidad}</p>
                </div>
                <span className="checkout__sidebar-precio">
                  ${(item.precio * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="checkout__sidebar-totales">
            <div className="checkout__sidebar-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout__sidebar-row">
              <span>Impuestos</span>
              <span>${impuestos.toFixed(2)}</span>
            </div>
            <div className="checkout__sidebar-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
