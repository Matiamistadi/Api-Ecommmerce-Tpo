import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FlaskConical,
  Mail,
  Tag,
  Truck,
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { cn } from '@/lib/utils';

const ICON_CLASS = 'size-10';

const FEATURES = [
  {
    Icon: Truck,
    title: 'Envío Rápido',
    description: 'Entrega en 24-48hs a todo el país.',
  },
  {
    Icon: BadgeCheck,
    title: 'Productos Certificados',
    description: 'Marcas líderes con trazabilidad garantizada.',
  },
  {
    Icon: FlaskConical,
    title: 'Fórmulas Puras',
    description: 'Ingredientes de alta biodisponibilidad.',
  },
  {
    Icon: Tag,
    title: 'Precios Competitivos',
    description: 'La mejor relación calidad-precio del mercado.',
  },
];

const HERO_BG_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80';

const getDiscount = (producto) => {
  if (!producto?.precioOriginal) return 0;
  return Math.round((1 - producto.precio / producto.precioOriginal) * 100);
};

const Home = () => {
  const { productos, loading, error } = useProducts();
  const productosActivos = productos.filter((p) => p.activo !== false);
  const ofertas = [...productosActivos]
    .filter((p) => p.precioOriginal)
    .sort((a, b) => getDiscount(b) - getDiscount(a))
    .slice(0, 3);
  const productosBase = productosActivos.slice(0, 3);
  const productosParaMostrar = ofertas.length > 0 ? ofertas : productosBase;
  const [suscripto, setSuscripto] = useState(false);

  const handleSuscribirse = (e) => {
    e.preventDefault();
    setSuscripto(true);
    setTimeout(() => setSuscripto(false), 4000);
  };

  return (
    <div className="home w-full">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-68px)] items-center overflow-hidden bg-gym-primary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG_IMAGE})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-gym-primary/95 via-gym-primary/80 to-gym-primary/35"
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-2 md:gap-12 md:px-12 md:py-16">
          <div className="text-center md:text-left">
            <p className="mb-5 text-[13px] font-bold tracking-[0.14em] text-gym-accent uppercase">
              NUTRICIÓN PREMIUM
            </p>
            <h1
              className={cn(
                'mb-6 font-gym-heading text-4xl leading-[1.05] font-extrabold tracking-tight text-white uppercase',
                'sm:text-5xl lg:text-6xl'
              )}
            >
              IMPULSA TU
              <br />
              RENDIMIENTO
            </h1>
            <p className="mx-auto mb-9 max-w-md text-base leading-relaxed text-white/70 md:mx-0">
              Alcanza tus metas con nuestra selección élite de suplementos. Proteínas,
              pre-entrenos y vitaminas diseñadas para atletas exigentes.
            </p>
            <Link
              to="/suplementos"
              className={cn(
                'inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-bold no-underline',
                'bg-gym-accent text-gym-primary',
                'shadow-[0_8px_24px_rgba(0,212,170,0.35)] transition-all',
                'hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,212,170,0.45)]'
              )}
            >
              Comprar Ahora
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gym-surface-low px-6 py-14" aria-label="Beneficios">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, description }) => (
            <article
              key={title}
              className={cn(
                'rounded-2xl bg-gym-surface p-7 shadow-[var(--shadow-card)]',
                'transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]'
              )}
            >
              <Icon
                className={cn(ICON_CLASS, 'mb-4 text-gym-accent')}
                strokeWidth={1.5}
                aria-hidden
              />
              <h2 className="mb-2 font-gym-heading text-[17px] font-bold text-gym-text">
                {title}
              </h2>
              <p className="text-sm leading-normal text-gym-text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section
        className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20"
        aria-labelledby="home-products-heading"
      >
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2
              id="home-products-heading"
              className="mb-2 font-gym-heading text-3xl font-extrabold text-gym-text md:text-4xl"
            >
              Ofertas Destacadas
            </h2>
            <p className="text-[15px] text-gym-text-muted">
              Los favoritos de nuestros atletas con descuentos exclusivos.
            </p>
          </div>
          <Link
            to="/suplementos"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-gym-text no-underline transition-colors hover:text-gym-accent"
          >
            Ver todas
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 justify-items-center gap-7 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-gym-text-muted">
            No se pudo conectar con el servidor. Verificá que el backend esté corriendo.
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 justify-items-center gap-7 md:grid-cols-2 lg:grid-cols-3">
            {productosParaMostrar.map((producto) => (
              <ProductCard key={producto.id} producto={producto} variant="home" />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section
        className="bg-gradient-to-b from-[#12121f] to-[#0a0a12] px-6 py-16 text-center text-white md:py-20"
        aria-labelledby="home-newsletter-heading"
      >
        <Mail className="mx-auto mb-5 size-12 text-gym-accent" strokeWidth={1.5} aria-hidden />
        <h2
          id="home-newsletter-heading"
          className="mb-3 font-gym-heading text-3xl font-extrabold md:text-4xl"
        >
          Únete a la Élite
        </h2>
        <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-white/55">
          Recibí tips de entrenamiento, ofertas exclusivas y acceso anticipado a nuevos
          lanzamientos.
        </p>
        {suscripto ? (
          <div className="mx-auto flex max-w-[440px] items-center justify-center gap-3 rounded-2xl border border-gym-accent/30 bg-gym-accent/10 px-6 py-4 sm:rounded-full">
            <CheckCircle2 className="size-5 shrink-0 text-gym-accent" aria-hidden />
            <p className="text-sm font-semibold text-gym-accent">
              ¡Listo! Te avisaremos con las mejores ofertas.
            </p>
          </div>
        ) : (
          <form
            className="mx-auto flex max-w-[440px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:flex-row sm:rounded-full"
            onSubmit={handleSuscribirse}
          >
            <input
              type="email"
              className="min-w-0 flex-1 border-none bg-transparent px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/40"
              placeholder="tu@email.com"
              aria-label="Correo electrónico"
              required
            />
            <button
              type="submit"
              className={cn(
                'shrink-0 border-none px-6 py-3.5 text-sm font-bold',
                'bg-gym-accent text-gym-primary transition-opacity hover:opacity-90'
              )}
            >
              Suscribirse
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Home;
