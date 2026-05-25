import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <section className="home">
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