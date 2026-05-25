import { Link } from 'react-router-dom';
import './Confirmacion.css';

const Confirmacion = () => {
  const numeroOrden = '#GS-' + Math.floor(10000 + Math.random() * 90000);

  return (
    <main className="confirmacion">
      <div className="confirmacion__card">
        <div className="confirmacion__icono">✓</div>
        <h1 className="confirmacion__titulo">¡Pago confirmado!</h1>
        <p className="confirmacion__orden">Orden {numeroOrden}</p>
        <p className="confirmacion__mensaje">
          Tu pedido fue procesado con éxito. Recibirás un email con los detalles y el seguimiento del envío en los próximos minutos.
        </p>

        <div className="confirmacion__detalle">
          <div className="confirmacion__detalle-row">
            <span>Estado del pago</span>
            <span className="confirmacion__badge">✓ Aprobado</span>
          </div>
          <div className="confirmacion__detalle-row">
            <span>Envío estimado</span>
            <span>3-5 días hábiles</span>
          </div>
        </div>

        <div className="confirmacion__acciones">
          <Link to="/" className="confirmacion__btn-primary">
            Volver al inicio
          </Link>
          <Link to="/perfil" className="confirmacion__btn-secondary">
            Ver mis pedidos →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Confirmacion;
