import { Truck, Clock, RotateCcw, PackageCheck } from 'lucide-react';
import './InfoPage.css';

const Envios = () => (
  <main className="info-page">
    <p className="info-page__eyebrow">Ayuda</p>
    <h1 className="info-page__title">Envíos y devoluciones</h1>
    <p className="info-page__subtitle">
      Queremos que tu compra llegue rápido y que comprar sea sin riesgo. Acá te contamos cómo funciona.
    </p>

    <div className="info-page__cards">
      <article className="info-page__card">
        <Truck className="info-page__card-icon" size={28} />
        <h3>Envío a todo el país</h3>
        <p>Llegamos a toda la Argentina con seguimiento de tu pedido.</p>
      </article>
      <article className="info-page__card">
        <Clock className="info-page__card-icon" size={28} />
        <h3>24-48 hs de despacho</h3>
        <p>Preparamos tu pedido apenas se confirma la compra.</p>
      </article>
      <article className="info-page__card">
        <PackageCheck className="info-page__card-icon" size={28} />
        <h3>Envío gratis</h3>
        <p>En compras superiores a $50.000.</p>
      </article>
    </div>

    <div className="info-page__section">
      <h2>Tiempos de entrega</h2>
      <p>
        En CABA y Gran Buenos Aires, la entrega suele demorar entre 1 y 3 días hábiles. Al interior del
        país, entre 3 y 7 días hábiles según la zona. Vas a poder seguir el estado de tu pedido desde
        "Mi cuenta".
      </p>
    </div>

    <div className="info-page__section">
      <h2>Costos de envío</h2>
      <p>
        El costo se calcula automáticamente al finalizar la compra según tu dirección. En pedidos
        superiores a $50.000 el envío es totalmente gratis.
      </p>
    </div>

    <div className="info-page__section">
      <h2><RotateCcw size={18} style={{ verticalAlign: '-3px', marginRight: 6, color: 'var(--color-accent)' }} />Cambios y devoluciones</h2>
      <p>
        Si algo no salió como esperabas, tenés 30 días desde la recepción para solicitar un cambio o
        devolución, siempre que el producto esté cerrado y sin usar. Escribinos desde la página de
        contacto y te guiamos en el proceso.
      </p>
    </div>
  </main>
);

export default Envios;
