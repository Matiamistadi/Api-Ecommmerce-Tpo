import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const SLIDES = [
  { img: '/img/BannerNexa.png', alt: 'NEXA Suplementos' },
  { img: '/img/BannerBull.png', alt: 'BULL Suplementos' },
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % SLIDES.length);
  }, []);

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="home">
      <div className="carousel">
        <div className="carousel__track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {SLIDES.map((slide, i) => (
            <div key={i} className="carousel__slide">
              <img src={slide.img} alt={slide.alt} className="carousel__img" />
              <div className="carousel__overlay">
                <Link to="/suplementos" className="carousel__cta">Ver Productos →</Link>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel__arrow carousel__arrow--prev" onClick={prev} aria-label="Anterior">‹</button>
        <button className="carousel__arrow carousel__arrow--next" onClick={next} aria-label="Siguiente">›</button>

        <div className="carousel__dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`carousel__dot ${i === current ? 'carousel__dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="home__hero">
        <p className="home__eyebrow">NUTRICIÓN PREMIUM</p>
        <h1 className="home__title">IMPULSA TU<br />RENDIMIENTO</h1>
        <p className="home__subtitle">
          Alcanza tus metas con nuestra selección élite de suplementos.
          Proteínas, pre-entrenos y vitaminas diseñadas para atletas exigentes.
        </p>
        <Link to="/suplementos" className="home__cta">Comprar Ahora →</Link>
      </div>
    </section>
  );
};

export default Home;
