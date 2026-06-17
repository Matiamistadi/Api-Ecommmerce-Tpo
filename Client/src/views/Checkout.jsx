import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { realizarCheckout } from '../services/checkoutService';
import { formatPrecio } from '@/lib/formato';
import { API_URL } from '../services/api';
import { CreditCard, Lock, Tag } from 'lucide-react';
import './Checkout.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, subtotal, vaciarCarrito } = useCart();
  const { usuario } = useAuth();
  const { recargarProductos } = useProducts();
  const isCheckingOut = useRef(false);

  const [form, setForm] = useState({
    email: usuario?.email || '',
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    cvv: '',
  });

  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);

  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(null); // { codigo, descuento }
  const [errorCupon, setErrorCupon] = useState('');
  const [validandoCupon, setValidandoCupon] = useState(false);

  const aplicarCupon = async () => {
    if (!codigoCupon.trim()) return;
    setValidandoCupon(true);
    setErrorCupon('');
    try {
      const res = await fetch(`${API_URL}/api/cupones/validar?codigo=${encodeURIComponent(codigoCupon)}&subtotal=${subtotal}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.mensaje || 'Cupón inválido');
      }
      const data = await res.json();
      setCuponAplicado({ codigo: data.codigo, descuento: data.descuento });
    } catch (err) {
      setErrorCupon(err.message);
      setCuponAplicado(null);
    } finally {
      setValidandoCupon(false);
    }
  };

  const quitarCupon = () => {
    setCuponAplicado(null);
    setCodigoCupon('');
    setErrorCupon('');
  };

  useEffect(() => {
    if (carrito.length === 0 && !isCheckingOut.current) {
      navigate('/carrito');
    }
  }, [carrito, navigate]);

  // El checkout contra el backend requiere estar logueado (el carrito es por usuario)
  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    }
  }, [usuario, navigate]);

  const descuentoCupon = cuponAplicado?.descuento ?? 0;
  const impuestos = subtotal * 0.08;
  const total = subtotal + impuestos - descuentoCupon;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const formatTarjeta = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatVencimiento = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const validarTodo = () => {
    const e = {};
    if (!form.email || !form.email.includes('@')) {
      e.email = 'Ingresá un correo electrónico válido.';
    }
    if (!form.nombre) {
      e.nombre = 'Ingresá tu nombre completo.';
    }
    if (!form.telefono) {
      e.telefono = 'Ingresá tu teléfono.';
    }
    if (!form.direccion) {
      e.direccion = 'Ingresá tu dirección de facturación.';
    }
    if (!form.ciudad) {
      e.ciudad = 'Ingresá tu ciudad.';
    }
    if (!form.codigoPostal) {
      e.codigoPostal = 'Ingresá tu código postal.';
    }
    if (!form.numeroTarjeta || form.numeroTarjeta.replace(/\s/g, '').length < 16) {
      e.numeroTarjeta = 'Ingresá un número de tarjeta válido.';
    }
    if (!form.fechaVencimiento || !/^\d{2}\/\d{2}$/.test(form.fechaVencimiento)) {
      e.fechaVencimiento = 'Ingresá el vencimiento en formato MM/AA.';
    }
    if (!form.cvv || form.cvv.length < 3) {
      e.cvv = 'Ingresá un CVV válido.';
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarTodo()) {
      return;
    }

    setProcesando(true);
    setErrores({});
    try {
      // Llama al backend: crea dirección → carrito → items → confirma (genera la orden)
      const orden = await realizarCheckout({
        usuarioId: usuario.id,
        items: carrito,
        codigoCupon: cuponAplicado?.codigo ?? null,
        direccion: {
          nombre: form.nombre,
          telefono: form.telefono,
          calle: form.direccion,
          ciudad: form.ciudad,
          provincia: '',
          codigoPostal: form.codigoPostal,
          // Queda como principal para que aparezca destacada en el perfil del usuario
          esPrincipal: true,
        },
      });

      // Guardamos el resumen para la pantalla de confirmación
      sessionStorage.setItem('ultimo_pedido_numero', `#${orden.id}`);
      sessionStorage.setItem('ultimo_pedido_items', JSON.stringify(carrito));
      sessionStorage.setItem('ultimo_pedido_total', String(total));
      sessionStorage.setItem('ultimo_pedido_subtotal', String(subtotal));
      sessionStorage.setItem('ultimo_pedido_envio', 'Gratis');
      sessionStorage.setItem('ultimo_pedido_direccion', JSON.stringify({
        nombre: form.nombre,
        direccion: form.direccion,
        ciudad: form.ciudad,
        codigoPostal: form.codigoPostal,
      }));

      isCheckingOut.current = true;
      vaciarCarrito();
      // Refrescamos los productos para que el stock en pantalla quede actualizado
      recargarProductos();
      navigate('/confirmacion');
    } catch (err) {
      // Si algo falla (sin stock, sesión vencida, etc.) lo mostramos sin romper la app
      setErrores({ general: err.message });
    } finally {
      setProcesando(false);
    }
  };

  const isStep1Active = true;
  const isStep2Active = form.email.includes('@');
  const isStep3Active = isStep2Active && form.nombre && form.direccion && form.ciudad && form.codigoPostal;

  if (carrito.length === 0) {
    return null;
  }

  return (
    <main className="checkout">
      <div className="checkout__container">

        <header className="checkout__header">
          <h1 className="checkout__title">Finalizar Compra</h1>
          <p className="checkout__subtitle">Completa tu información para procesar el pedido.</p>
        </header>

        <form onSubmit={handleSubmit} className="checkout__main" noValidate>

          {/* Sección 1: Identificación */}
          <section className="checkout__seccion">
            <div className="checkout__seccion-header">
              <div className={`checkout__step-circle ${isStep1Active ? 'checkout__step-circle--active' : ''}`}>1</div>
              <h2 className={`checkout__seccion-title ${isStep1Active ? 'checkout__seccion-title--active' : ''}`}>Identificación</h2>
            </div>

            <div className="checkout__form-fields">
              <div className="checkout__field">
                <Input
                  name="email"
                  type="email"
                  placeholder="Correo Electrónico"
                  className={`checkout__input h-auto ${errores.email ? 'checkout__input--error' : ''}`}
                  value={form.email}
                  onChange={handleChange}
                />
                {errores.email && <span className="checkout__field-error">{errores.email}</span>}
              </div>
            </div>
          </section>

          {/* Sección 2: Facturación */}
          <section className="checkout__seccion">
            <div className="checkout__seccion-header">
              <div className={`checkout__step-circle ${isStep2Active ? 'checkout__step-circle--active' : ''}`}>2</div>
              <h2 className={`checkout__seccion-title ${isStep2Active ? 'checkout__seccion-title--active' : ''}`}>Facturación</h2>
            </div>

            <div className="checkout__form-fields">
              <div className="checkout__field">
                <Input
                  name="nombre"
                  type="text"
                  placeholder="Nombre Completo"
                  className={`checkout__input h-auto ${errores.nombre ? 'checkout__input--error' : ''}`}
                  value={form.nombre}
                  onChange={handleChange}
                />
                {errores.nombre && <span className="checkout__field-error">{errores.nombre}</span>}
              </div>

              <div className="checkout__field">
                <Input
                  name="telefono"
                  type="tel"
                  placeholder="Teléfono"
                  className={`checkout__input h-auto ${errores.telefono ? 'checkout__input--error' : ''}`}
                  value={form.telefono}
                  onChange={handleChange}
                />
                {errores.telefono && <span className="checkout__field-error">{errores.telefono}</span>}
              </div>

              <div className="checkout__field">
                <Input
                  name="direccion"
                  type="text"
                  placeholder="Dirección"
                  className={`checkout__input h-auto ${errores.direccion ? 'checkout__input--error' : ''}`}
                  value={form.direccion}
                  onChange={handleChange}
                />
                {errores.direccion && <span className="checkout__field-error">{errores.direccion}</span>}
              </div>

              <div className="checkout__row-2">
                <div className="checkout__field">
                  <Input
                    name="ciudad"
                    type="text"
                    placeholder="Ciudad"
                    className={`checkout__input h-auto ${errores.ciudad ? 'checkout__input--error' : ''}`}
                    value={form.ciudad}
                    onChange={handleChange}
                  />
                  {errores.ciudad && <span className="checkout__field-error">{errores.ciudad}</span>}
                </div>

                <div className="checkout__field">
                  <Input
                    name="codigoPostal"
                    type="text"
                    placeholder="Código Postal"
                    className={`checkout__input h-auto ${errores.codigoPostal ? 'checkout__input--error' : ''}`}
                    value={form.codigoPostal}
                    onChange={handleChange}
                  />
                  {errores.codigoPostal && <span className="checkout__field-error">{errores.codigoPostal}</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Sección 3: Pago */}
          <section className="checkout__seccion">
            <div className="checkout__seccion-header">
              <div className={`checkout__step-circle ${isStep3Active ? 'checkout__step-circle--active' : ''}`}>3</div>
              <h2 className={`checkout__seccion-title ${isStep3Active ? 'checkout__seccion-title--active' : ''}`}>Pago</h2>
            </div>

            <div className="checkout__form-fields">
              <div className="checkout__field">
                <div className="checkout__input-wrapper">
                  <Input
                    name="numeroTarjeta"
                    type="text"
                    placeholder="Número de Tarjeta"
                    className={`checkout__input pr-12 h-auto ${errores.numeroTarjeta ? 'checkout__input--error' : ''}`}
                    value={form.numeroTarjeta}
                    onChange={(e) => setForm({ ...form, numeroTarjeta: formatTarjeta(e.target.value) })}
                    maxLength={19}
                  />
                  <CreditCard className="checkout__input-icon" size={18} />
                </div>
                {errores.numeroTarjeta && <span className="checkout__field-error">{errores.numeroTarjeta}</span>}
              </div>

              <div className="checkout__row-2">
                <div className="checkout__field">
                  <Input
                    name="fechaVencimiento"
                    type="text"
                    placeholder="Fecha (MM/AA)"
                    className={`checkout__input h-auto ${errores.fechaVencimiento ? 'checkout__input--error' : ''}`}
                    value={form.fechaVencimiento}
                    onChange={(e) => setForm({ ...form, fechaVencimiento: formatVencimiento(e.target.value) })}
                    maxLength={5}
                  />
                  {errores.fechaVencimiento && <span className="checkout__field-error">{errores.fechaVencimiento}</span>}
                </div>

                <div className="checkout__field">
                  <Input
                    name="cvv"
                    type="password"
                    placeholder="CVV"
                    className={`checkout__input h-auto ${errores.cvv ? 'checkout__input--error' : ''}`}
                    value={form.cvv}
                    onChange={handleChange}
                    maxLength={4}
                  />
                  {errores.cvv && <span className="checkout__field-error">{errores.cvv}</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Cupón de descuento */}
          <section className="checkout__seccion">
            <div className="checkout__seccion-header">
              <Tag size={18} />
              <h2 className="checkout__seccion-title checkout__seccion-title--active">Cupón de descuento</h2>
            </div>
            {cuponAplicado ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0' }}>
                <span style={{ color: 'var(--gym-accent, #10b981)', fontWeight: 600 }}>
                  ✓ {cuponAplicado.codigo} — {formatPrecio(cuponAplicado.descuento)} de descuento
                </span>
                <button type="button" onClick={quitarCupon} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Quitar</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Input
                  type="text"
                  placeholder="Código de cupón"
                  className="checkout__input h-auto"
                  value={codigoCupon}
                  onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), aplicarCupon())}
                />
                <Button type="button" onClick={aplicarCupon} disabled={validandoCupon} className="h-auto px-4" variant="outline">
                  {validandoCupon ? '...' : 'Aplicar'}
                </Button>
              </div>
            )}
            {errorCupon && <span className="checkout__field-error">{errorCupon}</span>}
          </section>

          <div className="checkout__acciones">
            {errores.general && <span className="checkout__field-error">{errores.general}</span>}

            <Button
              type="submit"
              className="checkout__btn-confirm h-auto w-full"
              disabled={procesando}
            >
              {procesando ? 'PROCESANDO...' : `FINALIZAR PEDIDO • ${formatPrecio(total)}`}
            </Button>

            <p className="checkout__seguridad">
              <Lock size={14} /> Transacción segura y encriptada
            </p>
          </div>

        </form>

      </div>
    </main>
  );
};

export default Checkout;
