import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <main className="home">
      <section className="home__banner">
        <div className="home__banner-inner">
          <div className="home__copy">
            <span className="home__eyebrow">GymStore Performance</span>
            <h1 className="home__title">Impulsá tu entrenamiento con foco y energía real.</h1>
            <p className="home__subtitle">
              Suplementos premium, una experiencia clara y un flujo de compra pensado para atletas que quieren avanzar sin distraerse.
            </p>

            <div className="home__actions">
              <Link to="/suplementos" className="home__cta home__cta--primary">Ver productos</Link>
              <Link to="/carrito" className="home__cta home__cta--secondary">Ir al carrito</Link>
            </div>

            <div className="home__stats" aria-label="Indicadores destacados">
              <div className="home__stat">
                <strong>+120</strong>
                <span>productos activos</span>
              </div>
              <div className="home__stat">
                <strong>24/7</strong>
                <span>compra simple</span>
              </div>
              <div className="home__stat">
                <strong>100%</strong>
                <span>texto en español</span>
              </div>
            </div>
          </div>

          <div className="home__visual">
            <div className="home__product-card">
              <span className="home__product-chip">Best seller</span>
              <img src="/img/BannerNexa.png" alt="Suplemento destacado GymStore" className="home__product-image" />
              <div className="home__product-meta">
                <p>Pack de rendimiento</p>
                <span>Proteínas, pre-work y recuperación</span>
              </div>
            </div>
            <div className="home__floating-card home__floating-card--top">
              <span className="home__floating-label">Entrega rápida</span>
              <strong>24 a 72 hs</strong>
            </div>
            <div className="home__floating-card home__floating-card--bottom">
              <span className="home__floating-label">Compra segura</span>
              <strong>Checkout guiado</strong>
            </div>
          </div>
        </div>

        <div className="home__feature-grid">
          <article className="home__feature-card">
            <span className="home__feature-icon">⚡</span>
            <h2>Más energía</h2>
            <p>Pre-entrenos y creatinas para empujar cada sesión.</p>
          </article>
          <article className="home__feature-card">
            <span className="home__feature-icon">💪</span>
            <h2>Mejor recuperación</h2>
            <p>BCAA, EAA y proteínas para volver al entrenamiento más rápido.</p>
          </article>
          <article className="home__feature-card">
            <span className="home__feature-icon">📦</span>
            <h2>Compra clara</h2>
            <p>Un flujo simple que lleva directo al carrito y al pago.</p>
          </article>
        </div>

        <section className="home__newsletter" aria-label="Newsletter">
          <div>
            <span className="home__newsletter-kicker">Novedades semanales</span>
            <h2 className="home__newsletter-title">Recibí lanzamientos y promociones en tu correo.</h2>
          </div>
          <form className="home__newsletter-form">
            <label className="sr-only" htmlFor="home-email">Correo electrónico</label>
            <input id="home-email" type="email" placeholder="tuemail@ejemplo.com" className="home__newsletter-input" />
            <button type="button" className="home__newsletter-button">Suscribirme</button>
          </form>
        </section>
      </section>
    </main>
  );
};

export default Home;
