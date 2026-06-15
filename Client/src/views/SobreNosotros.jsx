import { Target, ShieldCheck, Truck } from 'lucide-react';
import './InfoPage.css';

const SobreNosotros = () => (
  <main className="info-page">
    <p className="info-page__eyebrow">Sobre nosotros</p>
    <h1 className="info-page__title">Más que suplementos, tu equipo de rendimiento</h1>
    <p className="info-page__subtitle">
      GymStore nació de la misma pasión que tenés vos: entrenar en serio y dar lo mejor en cada sesión.
      Por eso seleccionamos solo productos certificados de las marcas en las que confiamos, para que
      tu única preocupación sea progresar.
    </p>

    <div className="info-page__cards">
      <article className="info-page__card">
        <ShieldCheck className="info-page__card-icon" size={28} />
        <h3>Productos certificados</h3>
        <p>Trabajamos únicamente con marcas líderes y trazabilidad garantizada.</p>
      </article>
      <article className="info-page__card">
        <Target className="info-page__card-icon" size={28} />
        <h3>Asesoramiento real</h3>
        <p>Te ayudamos a elegir lo que de verdad necesitás para tu objetivo.</p>
      </article>
      <article className="info-page__card">
        <Truck className="info-page__card-icon" size={28} />
        <h3>Envíos a todo el país</h3>
        <p>Despachamos en 24-48 hs para que entrenes sin frenar.</p>
      </article>
    </div>

    <div className="info-page__section">
      <h2>Nuestra misión</h2>
      <p>
        Acercar suplementación de calidad a precios justos, con información honesta y un servicio
        en el que se pueda confiar. Creemos que un buen producto, bien explicado, hace la diferencia.
      </p>
    </div>

    <div className="info-page__section">
      <h2>Por qué elegirnos</h2>
      <p>
        Porque somos parte de la comunidad fitness y consumimos lo que vendemos. Cada producto del
        catálogo pasó por nuestras manos antes de llegar a las tuyas.
      </p>
    </div>
  </main>
);

export default SobreNosotros;
