import { Link } from 'react-router-dom';
import './Footer.css';

// Íconos de marca como SVG propios (lucide-react ya no los exporta)
const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const InstagramIcon = () => (
  <svg {...iconProps}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg {...iconProps}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const XIcon = () => (
  <svg {...iconProps}>
    <path d="M18.9 3H22l-6.78 7.73L23.2 21h-6.6l-5.18-6.1L5.9 21H2.8l7.22-8.25L1 3h6.76l4.72 5.53L18.9 3zm-1.16 16h1.72L7.82 4.86H5.97L17.74 19z" />
  </svg>
);

const Footer = () => {
  const anio = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">GymStore</Link>
          <p className="footer__tagline">
            Suplementos deportivos premium. Energía con disciplina.
          </p>
          <div className="footer__social">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer__social-link"><InstagramIcon /></a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer__social-link"><FacebookIcon /></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="footer__social-link"><XIcon /></a>
          </div>
        </div>

        <nav className="footer__col">
          <h4 className="footer__col-title">Tienda</h4>
          <Link to="/productos" className="footer__link">Productos</Link>
          <Link to="/carrito" className="footer__link">Carrito</Link>
          <Link to="/perfil" className="footer__link">Mi cuenta</Link>
        </nav>

        <nav className="footer__col">
          <h4 className="footer__col-title">Ayuda</h4>
          <Link to="/faq" className="footer__link">Preguntas frecuentes</Link>
          <Link to="/envios" className="footer__link">Envíos y devoluciones</Link>
          <Link to="/contacto" className="footer__link">Contacto</Link>
        </nav>

        <nav className="footer__col">
          <h4 className="footer__col-title">Empresa</h4>
          <Link to="/sobre-nosotros" className="footer__link">Sobre nosotros</Link>
        </nav>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">© {anio} GymStore. Todos los derechos reservados.</p>
        <p className="footer__legal">Hecho en Argentina</p>
      </div>
    </footer>
  );
};

export default Footer;
