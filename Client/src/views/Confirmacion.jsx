import { Link } from 'react-router-dom';
import './Confirmacion.css';

const Confirmacion = () => {
  const numeroOrden = '#GS-' + Math.floor(10000 + Math.random() * 90000);

  return (
    <main className="confirmacion">
      <section className="confirmacion__hero">
        <div className="confirmacion__card">
          <div className="confirmacion__icono" aria-hidden="true">✓</div>
          <p className="confirmacion__eyebrow">Pago confirmado</p>
          <h1 className="confirmacion__titulo">Tu compra se realizó con éxito.</h1>
          <p className="confirmacion__orden">Orden {numeroOrden}</p>
          <p className="confirmacion__mensaje">
            Recibirás por correo el detalle de tu pedido y la información de seguimiento en los próximos minutos.
          </p>

          <div className="confirmacion__detalle">
            <div className="confirmacion__detalle-row">
              <span>Estado del pago</span>
              <span className="confirmacion__badge">Aprobado</span>
            </div>
            <div className="confirmacion__detalle-row">
              <span>Estimación de envío</span>
              <span>3 a 5 días hábiles</span>
            </div>
          </div>

          <div className="confirmacion__acciones">
            <Link to="/" className="confirmacion__btn-primary">Volver al inicio</Link>
            <Link to="/perfil" className="confirmacion__btn-secondary">Ver mis pedidos</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Confirmacion;
