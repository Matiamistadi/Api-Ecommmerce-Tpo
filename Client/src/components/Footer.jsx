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
          <a href="#" className="footer__link">Sobre Nosotros</a>
          <a href="#" className="footer__link">Política de Envío</a>
          <a href="#" className="footer__link">Devoluciones</a>
          <a href="#" className="footer__link">Política de Privacidad</a>
          <a href="#" className="footer__link">Contacto</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
