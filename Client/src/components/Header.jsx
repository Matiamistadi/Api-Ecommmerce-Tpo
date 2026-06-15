import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { totalItems } = useCart();
  const { esAdmin, estaLogueado } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">GymStore</Link>

        <button
          type="button"
          className="header__menu-button"
          aria-expanded={menuOpen}
          aria-controls="header-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          ☰
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} id="header-navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'header__link header__link--active' : 'header__link'
            }
            end
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/productos"
            className={({ isActive }) =>
              isActive ? 'header__link header__link--active' : 'header__link'
            }
            onClick={() => setMenuOpen(false)}
          >
            Productos
          </NavLink>
        </nav>

        <div className="header__actions">
          <Link to="/carrito" className="header__icon header__icon--cart" aria-label="Carrito">
            🛒
            {totalItems > 0 && <span className="header__badge">{totalItems}</span>}
          </Link>
          {/* Si ya inició sesión, el ícono lleva a su perfil; si no, al login */}
          <Link to={estaLogueado ? '/perfil' : '/login'} className="header__icon" aria-label="Perfil">👤</Link>
          {/* El botón Admin solo aparece si el usuario logueado tiene rol ADMIN */}
          {esAdmin && (
            <Link to="/admin" className="header__admin-link" aria-label="Admin">Admin</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;