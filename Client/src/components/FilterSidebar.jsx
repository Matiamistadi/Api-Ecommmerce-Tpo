import './FilterSidebar.css';

const categorias = ['Todas', 'Proteína', 'Energía', 'Recuperación', 'Fuerza', 'Vitaminas'];

const FilterSidebar = ({ categoriaSeleccionada, onCategoriaChange, onClose }) => {
  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__header">
        <h3 className="filter-sidebar__title">Filtros</h3>
        <div className="filter-sidebar__header-actions">
          <button
            className="filter-sidebar__clear"
            onClick={() => onCategoriaChange('Todas')}
            type="button"
          >
            Limpiar todo
          </button>
          <button className="filter-sidebar__close" type="button" onClick={onClose}>Cerrar</button>
        </div>
      </div>

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
    </aside>
  );
};

export default FilterSidebar;