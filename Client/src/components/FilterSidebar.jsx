import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FilterSidebar.css';

const categorias = ['Todas', 'Proteína', 'Energía', 'Recuperación', 'Fuerza'];

// Rangos predefinidos estilo Mercado Libre (en pesos). '' significa "sin límite".
const rangosPrecio = [
  { label: 'Hasta $20.000', min: '', max: '20000' },
  { label: '$20.000 a $30.000', min: '20000', max: '30000' },
  { label: '$30.000 a $40.000', min: '30000', max: '40000' },
  { label: 'Más de $40.000', min: '40000', max: '' },
];

// Encabezado clickeable de cada sección (fuera del componente: no se recrea en cada render)
const SectionHeader = ({ clave, titulo, abierto, onToggle }) => (
  <button
    type="button"
    className="filter-sidebar__section-toggle"
    onClick={() => onToggle(clave)}
    aria-expanded={abierto}
  >
    <span>{titulo}</span>
    <ChevronDown
      size={16}
      className={`filter-sidebar__chevron ${abierto ? 'filter-sidebar__chevron--open' : ''}`}
    />
  </button>
);

const FilterSidebar = ({
  categoriaSeleccionada,
  onCategoriaChange,
  marcas = ['Todas'],
  marcaSeleccionada,
  onMarcaChange,
  sabores = ['Todos'],
  saborSeleccionado,
  onSaborChange,
  precioMin,
  precioMax,
  onPrecioChange,
  onLimpiar,
  onClose,
}) => {
  // Inputs del rango personalizado (estado local hasta apretar "Aplicar")
  const [minInput, setMinInput] = useState(precioMin);
  const [maxInput, setMaxInput] = useState(precioMax);

  // Si el rango cambia desde afuera (un chip o "Limpiar"), sincronizamos los inputs.
  // Se ajusta durante el render (patrón recomendado por React), no en un efecto:
  // evita un repintado extra y no dispara nada fuera de React.
  const [precioMinPrevio, setPrecioMinPrevio] = useState(precioMin);
  const [precioMaxPrevio, setPrecioMaxPrevio] = useState(precioMax);
  if (precioMin !== precioMinPrevio) {
    setPrecioMinPrevio(precioMin);
    setMinInput(precioMin);
  }
  if (precioMax !== precioMaxPrevio) {
    setPrecioMaxPrevio(precioMax);
    setMaxInput(precioMax);
  }

  // Qué secciones están abiertas (acordeón). Solo Categorías arranca abierta.
  const [abiertos, setAbiertos] = useState({ categoria: true, marca: false, sabor: false, precio: false });
  const toggle = (clave) => setAbiertos((prev) => ({ ...prev, [clave]: !prev[clave] }));

  const [errorPrecio, setErrorPrecio] = useState('');

  const aplicarCustom = () => {
    // No permitimos un máximo menor que el mínimo (ej: mín 100, máx 10)
    if (minInput !== '' && maxInput !== '' && Number(maxInput) < Number(minInput)) {
      setErrorPrecio('El máximo no puede ser menor que el mínimo.');
      return;
    }
    setErrorPrecio('');
    onPrecioChange(minInput, maxInput);
  };
  const rangoActivo = (rango) => precioMin === rango.min && precioMax === rango.max;

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__header">
        <h3 className="filter-sidebar__title">Filtros</h3>
        <div className="filter-sidebar__header-actions">
          <button className="filter-sidebar__clear" onClick={onLimpiar} type="button">
            Limpiar todo
          </button>
          <button className="filter-sidebar__close" type="button" onClick={onClose}>Cerrar</button>
        </div>
      </div>

      {/* Categorías */}
      <div className="filter-sidebar__section">
        <SectionHeader clave="categoria" titulo="Categorías" abierto={abiertos.categoria} onToggle={toggle} />
        {abiertos.categoria && (
          <ul className="filter-sidebar__list">
            {categorias.map((cat) => (
              <li key={cat}>
                <label className="filter-sidebar__option">
                  <input
                    type="radio"
                    name="categoria"
                    value={cat}
                    checked={categoriaSeleccionada === cat}
                    onChange={(e) => onCategoriaChange(e.target.value)}
                  />
                  <span>{cat}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Marcas */}
      <div className="filter-sidebar__section">
        <SectionHeader clave="marca" titulo="Marcas" abierto={abiertos.marca} onToggle={toggle} />
        {abiertos.marca && (
          <ul className="filter-sidebar__list">
            {marcas.map((m) => (
              <li key={m}>
                <label className="filter-sidebar__option">
                  <input
                    type="radio"
                    name="marca"
                    value={m}
                    checked={marcaSeleccionada === m}
                    onChange={(e) => onMarcaChange(e.target.value)}
                  />
                  <span>{m}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Gusto / sabor */}
      {sabores.length > 1 && (
        <div className="filter-sidebar__section">
          <SectionHeader clave="sabor" titulo="Sabores" abierto={abiertos.sabor} onToggle={toggle} />
          {abiertos.sabor && (
            <ul className="filter-sidebar__list">
              {sabores.map((s) => (
                <li key={s}>
                  <label className="filter-sidebar__option">
                    <input
                      type="radio"
                      name="sabor"
                      value={s}
                      checked={saborSeleccionado === s}
                      onChange={(e) => onSaborChange(e.target.value)}
                    />
                    <span>{s}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Precio */}
      <div className="filter-sidebar__section">
        <SectionHeader clave="precio" titulo="Precio" abierto={abiertos.precio} onToggle={toggle} />
        {abiertos.precio && (
          <>
            <ul className="filter-sidebar__list">
              {rangosPrecio.map((rango) => (
                <li key={rango.label}>
                  <button
                    type="button"
                    className={`filter-sidebar__range ${rangoActivo(rango) ? 'filter-sidebar__range--active' : ''}`}
                    onClick={() => onPrecioChange(rango.min, rango.max)}
                  >
                    {rango.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="filter-sidebar__price-custom">
              <input
                type="text"
                inputMode="numeric"
                className="filter-sidebar__price-input"
                placeholder="Mínimo"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value.replace(/\D/g, ''))}
              />
              <span className="filter-sidebar__price-dash">–</span>
              <input
                type="text"
                inputMode="numeric"
                className="filter-sidebar__price-input"
                placeholder="Máximo"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value.replace(/\D/g, ''))}
              />
              <button type="button" className="filter-sidebar__price-apply" onClick={aplicarCustom}>
                Aplicar
              </button>
            </div>

            {errorPrecio && (
              <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '8px' }}>{errorPrecio}</p>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
