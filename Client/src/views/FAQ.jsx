import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './InfoPage.css';

const PREGUNTAS = [
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Despachamos dentro de las 24-48 hs hábiles. En CABA y GBA suele llegar en 1-3 días; al interior, entre 3 y 7 días hábiles según la zona.',
  },
  {
    q: '¿Cuánto cuesta el envío?',
    a: 'El costo se calcula al finalizar la compra según tu dirección. En compras superiores a $50.000 el envío es gratis.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Tarjeta de crédito y débito. La compra es 100% segura y encriptada.',
  },
  {
    q: '¿Los productos son originales?',
    a: 'Sí. Trabajamos solo con distribuidores oficiales y marcas certificadas, con trazabilidad garantizada.',
  },
  {
    q: '¿Puedo cambiar o devolver un producto?',
    a: 'Sí, tenés 30 días desde la recepción para solicitar un cambio o devolución, siempre que el producto esté cerrado y sin usar.',
  },
  {
    q: '¿Necesito crear una cuenta para comprar?',
    a: 'Sí, para asociar tu pedido y poder seguir su estado desde "Mi cuenta" necesitás iniciar sesión o registrarte. Es rápido y gratis.',
  },
];

const FAQ = () => {
  const [abierta, setAbierta] = useState(0);

  return (
    <main className="info-page">
      <p className="info-page__eyebrow">Ayuda</p>
      <h1 className="info-page__title">Preguntas frecuentes</h1>
      <p className="info-page__subtitle">
        Reunimos las dudas más comunes. Si no encontrás lo que buscás, escribinos desde la página de contacto.
      </p>

      <div>
        {PREGUNTAS.map((item, i) => (
          <div key={i} className="faq__item">
            <button
              className="faq__pregunta"
              onClick={() => setAbierta(abierta === i ? null : i)}
              aria-expanded={abierta === i}
            >
              {item.q}
              <ChevronDown size={18} className={`faq__chevron ${abierta === i ? 'faq__chevron--open' : ''}`} />
            </button>
            {abierta === i && <p className="faq__respuesta">{item.a}</p>}
          </div>
        ))}
      </div>
    </main>
  );
};

export default FAQ;
