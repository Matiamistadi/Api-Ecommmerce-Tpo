import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Truck, Receipt, ClipboardList } from 'lucide-react';
import './Confirmacion.css';
import { Button } from '@/components/ui/button';
import { formatPrecio } from '@/lib/formato';

const MOCK_FALLBACK_ITEMS = [
  {
    id: 1,
    nombre: 'Proteína Whey 100%',
    descripcion: 'Sabor: Vainilla Francesa • 2kg',
    categoria: 'Fuerza',
    precio: '€45.00',
    cantidad: 1,
    imagen: '/img/ProteVainilla.png'
  },
  {
    id: 2,
    nombre: 'Pre-Entreno Explosivo',
    descripcion: 'Sabor: Manzana Verde • 300g',
    categoria: 'Energía',
    precio: '€39.49',
    cantidad: 1,
    imagen: '/img/PreworkSandia.png'
  }
];

const Confirmacion = () => {
  // Usamos el número de orden real que devolvió el backend; si no hay, uno de respaldo
  const [numeroOrden] = useState(
    () => sessionStorage.getItem('ultimo_pedido_numero') || '#GS-' + Math.floor(10000 + Math.random() * 90000)
  );
  // Todo se lee una sola vez de sessionStorage al montar (lo dejó Checkout tras pagar).
  // Usamos inicializadores diferidos de useState en vez de un efecto: es estado inicial
  // derivado de una fuente externa, no algo que deba resincronizarse después.
  const [items] = useState(() => {
    const cachedItems = sessionStorage.getItem('ultimo_pedido_items');
    if (!cachedItems) return MOCK_FALLBACK_ITEMS;
    try {
      const parsedItems = JSON.parse(cachedItems);
      return parsedItems.map(item => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: `Sabor: Vainilla • Cantidad: ${item.cantidad}`,
        categoria: 'Suplementos',
        precio: formatPrecio(item.precio),
        cantidad: item.cantidad,
        imagen: item.imagenUrl || '/img/ProteVainilla.png'
      }));
    } catch (err) {
      console.error('Error parsing cached items:', err);
      return MOCK_FALLBACK_ITEMS;
    }
  });
  const [total] = useState(() => {
    const cachedTotal = sessionStorage.getItem('ultimo_pedido_total');
    return cachedTotal ? formatPrecio(Number(cachedTotal)) : '€84.49';
  });
  const [subtotal] = useState(() => {
    const cachedSubtotal = sessionStorage.getItem('ultimo_pedido_subtotal');
    return cachedSubtotal ? formatPrecio(Number(cachedSubtotal)) : '€84.49';
  });
  const [envio] = useState(() => sessionStorage.getItem('ultimo_pedido_envio') || 'Gratis');
  const [direccion] = useState(() => {
    const cachedDireccion = sessionStorage.getItem('ultimo_pedido_direccion');
    if (!cachedDireccion) {
      return {
        nombre: 'Atleta Destacado',
        direccion: 'Calle Gran Vía, 42',
        ciudad: 'Apt. 3B, 28013, Madrid',
        codigoPostal: 'España'
      };
    }
    try {
      const parsedDir = JSON.parse(cachedDireccion);
      return {
        nombre: parsedDir.nombre || 'Atleta Destacado',
        direccion: parsedDir.direccion || 'Calle Gran Vía, 42',
        ciudad: `${parsedDir.ciudad || 'Madrid'}, ${parsedDir.codigoPostal || '28013'}`,
        codigoPostal: 'España'
      };
    } catch (err) {
      console.error('Error parsing cached address:', err);
      return {
        nombre: 'Atleta Destacado',
        direccion: 'Calle Gran Vía, 42',
        ciudad: 'Apt. 3B, 28013, Madrid',
        codigoPostal: 'España'
      };
    }
  });

  return (
    <main className="confirmacion">
      <div className="confirmacion__container">

        {/* Encabezado de éxito centrado */}
        <header className="confirmacion__header">
          <div className="confirmacion__success-icon-box">
            <Check className="confirmacion__success-icon" size={28} strokeWidth={3} />
          </div>
          <h1 className="confirmacion__title">¡Gracias por tu compra!</h1>
          <p className="confirmacion__subtitle">
            Tu pedido <strong style={{ color: 'var(--color-text)' }}>{numeroOrden}</strong> ha sido procesado con éxito. Recibirás un correo de confirmación en breve con los detalles del envío.
          </p>
        </header>

        {/* Layout en Dos Columnas */}
        <div className="confirmacion__grid">

          {/* Columna Izquierda: Resumen del Pedido */}
          <div className="confirmacion__grid-left">
            <section className="confirmacion__card">
              <div className="confirmacion__card-header">
                <ClipboardList className="confirmacion__card-icon" size={20} />
                <h2 className="confirmacion__card-title">Resumen del Pedido</h2>
              </div>

              <div className="confirmacion__products-list">
                {items.map((item) => (
                  <div key={item.id} className="confirmacion__product-row">
                    <div className="confirmacion__product-cell">
                      <div className="confirmacion__product-img-box">
                        <img src={item.imagen} alt={item.nombre} className="confirmacion__product-img" />
                      </div>
                      <div className="confirmacion__product-info">
                        <span className="confirmacion__product-name">{item.nombre}</span>
                        <span className="confirmacion__product-desc">{item.descripcion}</span>
                        <span className="confirmacion__product-badge">{item.categoria}</span>
                      </div>
                    </div>
                    <div className="confirmacion__product-right">
                      <span className="confirmacion__product-price">{item.precio}</span>
                      <span className="confirmacion__product-qty">Cant: {item.cantidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Columna Derecha: Dirección de Envío y Desglose */}
          <div className="confirmacion__grid-right">

            {/* Tarjeta 1: Información de Envío */}
            <section className="confirmacion__card">
              <div className="confirmacion__card-header">
                <Truck className="confirmacion__card-icon" size={20} />
                <h2 className="confirmacion__card-title">Información de Envío</h2>
              </div>

              <div className="confirmacion__shipping-info">
                <span className="confirmacion__shipping-name">{direccion.nombre}</span>
                <p className="confirmacion__shipping-text">
                  {direccion.direccion}<br />
                  {direccion.ciudad}<br />
                  {direccion.codigoPostal}
                </p>
              </div>
            </section>

            {/* Tarjeta 2: Desglose */}
            <section className="confirmacion__summary-card">
              <div className="confirmacion__summary-header">
                <Receipt className="confirmacion__summary-card-icon" size={20} />
                <h2 className="confirmacion__summary-card-title">Desglose</h2>
              </div>

              <div className="confirmacion__summary-rows">
                <div className="confirmacion__summary-row">
                  <span>Subtotal</span>
                  <span className="confirmacion__summary-row-val">{subtotal}</span>
                </div>

                <div className="confirmacion__summary-row">
                  <span>Envío Estándar</span>
                  <span className="confirmacion__summary-row-val confirmacion__summary-row-val--free">{envio}</span>
                </div>

                <div className="confirmacion__summary-divider" />

                <div className="confirmacion__summary-total">
                  <span className="confirmacion__summary-total-lbl">Total</span>
                  <span className="confirmacion__summary-total-val">{total}</span>
                </div>
              </div>

              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button className="confirmacion__btn-inicio h-auto w-full">
                  Volver al Inicio
                </Button>
              </Link>
            </section>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Confirmacion;
