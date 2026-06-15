import { useState, useEffect } from 'react';
import './FilterSidebar.css';

const categorias = ['Todas', 'Proteína', 'Energía', 'Recuperación', 'Fuerza'];

// Rangos predefinidos estilo Mercado Libre (en pesos). '' significa "sin límite".
const rangosPrecio = [
  { label: 'Hasta $20.000', min: '', max: '20000' },
  { label: '$20.000 a $30.000', min: '20000', max: '30000' },
  { label: '$30.000 a $40.000', min: '30000', max: '40000' },
  { label: 'Más de $40.000', min: '40000', max: '' },
];

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

  // Si el rango cambia desde afuera (un chip o "Limpiar"), sincronizamos los inputs
  useEffect(() => setMinInput(precioMin), [precioMin]);
  useEffect(() => setMaxInput(precioMax), [precioMax]);

  const aplicarCustom = () => onPrecioChange(minInput, maxInput);
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
        <h4 className="filter-sidebar__section-title">Categorías</h4>
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
      </div>

      {/* Marcas */}
      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__section-title">Marcas</h4>
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
      </div>

      {/* Gusto / sabor */}
      {sabores.length > 1 && (
        <div className="filter-sidebar__section">
          <h4 className="filter-sidebar__section-title">Gusto</h4>
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
        </div>
      )}

      {/* Precio */}
      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__section-title">Precio</h4>
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
            type="number"
            className="filter-sidebar__price-input"
            placeholder="Mínimo"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
          />
          <span className="filter-sidebar__price-dash">–</span>
          <input
            type="number"
            className="filter-sidebar__price-input"
            placeholder="Máximo"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
          />
          <button type="button" className="filter-sidebar__price-apply" onClick={aplicarCustom}>
            Aplicar
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
