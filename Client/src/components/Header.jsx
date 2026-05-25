import { NavLink, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
          <Link to="/carrito" className="header__icon" aria-label="Carrito">🛒</Link>
          <Link to="/perfil" className="header__icon" aria-label="Perfil">👤</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;