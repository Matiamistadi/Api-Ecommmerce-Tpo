import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="placeholder">
    <h1 className="placeholder__title">404</h1>
    <p className="placeholder__text">Esta página no existe.</p>
    <Link to="/" className="home__cta">Volver al inicio</Link>
  </div>
);
export default NotFound;
