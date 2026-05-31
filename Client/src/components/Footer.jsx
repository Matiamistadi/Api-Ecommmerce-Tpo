import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">GymStore</Link>
          <p className="footer__copy">© 2026 GymStore. Disciplined Energy.</p>
        </div>

        <nav className="footer__links">
          <Link to="/productos" className="footer__link">Productos</Link>
          <Link to="/carrito" className="footer__link">Carrito</Link>
          <Link to="/perfil" className="footer__link">Mi cuenta</Link>
          <Link to="/admin" className="footer__link">Admin</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
