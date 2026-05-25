import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">GymStore</Link>

        <nav className="header__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'header__link header__link--active' : 'header__link'
            }
            end
          >
            Inicio
          </NavLink>
          <NavLink
            to="/suplementos"
            className={({ isActive }) =>
              isActive ? 'header__link header__link--active' : 'header__link'
            }
          >
            Suplementos
          </NavLink>
        </nav>

        <div className="header__actions">
          <Link to="/carrito" className="header__icon header__icon--cart" aria-label="Carrito">
            🛒
            {totalItems > 0 && <span className="header__badge">{totalItems}</span>}
          </Link>
          <Link to="/perfil" className="header__icon" aria-label="Perfil">👤</Link>
          <Link to="/admin" className="header__admin-link" aria-label="Admin">Admin</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;