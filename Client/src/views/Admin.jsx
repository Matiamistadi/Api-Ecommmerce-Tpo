import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useToast } from '../context/ToastContext';
import { formatPrecio } from '@/lib/formato';
import { AdminSidebar } from '../components/AdminSidebar';
import { getCategorias, getMarcas } from '../services/catalogoService';
import {
  Search, Plus, SlidersHorizontal, Download, Edit2, Eye, EyeOff, Trash2, AlertTriangle,
  Package, Shapes, Banknote, ChevronRight, UploadCloud, ChevronDown
} from 'lucide-react';

const CATEGORIAS = ['Proteína', 'Energía', 'Recuperación', 'Fuerza'];
const CATEGORIAS_PERMITIDAS = new Set(CATEGORIAS);

const formVacio = {
  nombre: '',
  descripcion: '',
  precio: '',
  precioOriginal: '',
  stock: '',
  categoriaId: '',
  marcaId: '',
  imagenes: [''],
  activo: true,
  oferta: false,
};

const Admin = () => {
  const { productos, agregarProducto, actualizarProducto, reemplazarImagenProducto, eliminarProducto, toggleActivo } = useProducts();
  const { mostrarToast } = useToast();
  const [busqueda, setBusqueda] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editando, setEditando] = useState(null);
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [form, setForm] = useState(formVacio);
  const [errores, setErrores] = useState({});
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroStock, setFiltroStock] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const [confirmarToggle, setConfirmarToggle] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    getCategorias()
      .then((data) => setCategorias(data.filter((categoria) => CATEGORIAS_PERMITIDAS.has(categoria.nombre))))
      .catch(() => setCategorias([]));
    getMarcas().then(setMarcas).catch(() => setMarcas([]));
  }, []);

  const filtrados = productos.filter((producto) => {
    const matchBusqueda = (
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      || producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
      || producto.marca.toLowerCase().includes(busqueda.toLowerCase())
    );
    const matchCategoria = filtroCategoria === 'Todas' || producto.categoria === filtroCategoria;
    const matchStock = !filtroStock || producto.stock < 15;
    return matchBusqueda && matchCategoria && matchStock;
  });

  const exportarCSV = () => {
    const encabezado = ['ID', 'Nombre', 'Marca', 'Categoría', 'Precio', 'Precio Original', 'Stock', 'Estado'];
    const filas = filtrados.map((p) => [
      p.id,
      `"${p.nombre}"`,
      `"${p.marca}"`,
      p.categoria,
      p.precio.toFixed(2),
      p.precioOriginal ? p.precioOriginal.toFixed(2) : '',
      p.stock,
      p.stock > 0 ? 'En Stock' : 'Sin Stock',
    ]);
    const csv = [encabezado, ...filas].map((fila) => fila.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventario.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const abrirAgregar = () => {
    setForm(formVacio);
    setEditando(null);
    setArchivoImagen(null);
    setIsAdding(true);
  };

  const abrirEditar = (producto) => {
    setArchivoImagen(null);
    let imagenes;
    if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
      imagenes = [...producto.imagenes];
    } else {
      imagenes = [producto.imagenUrl, producto.imagenDetalleUrl].filter(Boolean);
      if (imagenes.length === 0) imagenes = [''];
    }
    setForm({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precioOriginal ? producto.precio : '',
      precioOriginal: producto.precioOriginal || producto.precio || '',
      stock: producto.stock || '',
      categoriaId: categorias.find((categoria) => categoria.nombre === producto.categoria)?.id?.toString() || '',
      marcaId: marcas.find((marca) => marca.nombre === producto.marca)?.id?.toString() || '',
      imagenes,
      activo: producto.activo !== false,
      oferta: producto.oferta || false,
    });
    setEditando(producto);
    setIsAdding(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImagenChange = (index, value) => {
    setForm((prev) => {
      const imagenes = [...prev.imagenes];
      imagenes[index] = value;
      return { ...prev, imagenes };
    });
  };

  const handleImagenFile = (index, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    handleImagenChange(index, url); // preview temporal
    setArchivoImagen(file); // guardamos el archivo real para subirlo por multipart al guardar
  };

  const agregarImagenSlot = () => {
    setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, ''] }));
  };

  const eliminarImagenSlot = (index) => {
    setForm((prev) => {
      const imagenes = prev.imagenes.filter((_, i) => i !== index);
      return { ...prev, imagenes: imagenes.length > 0 ? imagenes : [''] };
    });
  };

  const handleSave = async () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!form.precioOriginal) nuevosErrores.precioOriginal = 'El precio es obligatorio';
    if (!form.stock) nuevosErrores.stock = 'El stock es obligatorio';
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    setErrores({});
    const imagenesValidas = form.imagenes.filter((url) => url.trim() !== '');
    const precioFinal = form.precio ? Number(form.precio) : Number(form.precioOriginal);
    const precioBase = form.precio ? Number(form.precioOriginal) : null;
    const datos = {
      ...form,
      precio: precioFinal,
      precioOriginal: precioBase,
      stock: Number(form.stock),
      imagenes: imagenesValidas.length > 0 ? imagenesValidas : ['/img/BannerNexa.png'],
      imagenUrl: imagenesValidas[0] || '/img/BannerNexa.png',
      imagenDetalleUrl: imagenesValidas[1] || imagenesValidas[0] || '/img/BannerNexa.png',
    };
    try {
      if (editando) {
        await actualizarProducto({ ...editando, ...datos });
        // Si elegiste una imagen nueva, la subimos por multipart y reemplaza la anterior
        if (archivoImagen) await reemplazarImagenProducto(editando.id, archivoImagen);
      } else {
        // Al crear, la imagen se sube junto con el producto nuevo
        await agregarProducto(datos, { principal: archivoImagen });
      }
      setArchivoImagen(null);
      setIsAdding(false);
      setEditando(null);
    } catch (err) {
      setErrores({ nombre: err.message });
    }
  };

  return (
    <div className="flex h-full bg-[#fafafa] font-sans w-full">
      <AdminSidebar />

      <main className="flex-1 ml-64 h-screen overflow-y-auto">
        {!isAdding ? (
          <div className="p-8 max-w-6xl mx-auto">
            {/* INVENTORY VIEW */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Inventario</h1>
                <p className="text-gray-500 text-sm">Administra tus productos, precios y niveles de stock.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#00e69e] outline-none transition-all shadow-sm"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <button
                  onClick={abrirAgregar}
                  className="bg-[#00e69e] hover:bg-[#00c98a] text-black px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Plus size={18} />
                  Agregar Nuevo Producto
                </button>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-gray-600 font-bold text-sm">Productos Totales</h3>
                  <div className="w-8 h-8 rounded bg-[#e6fff7] flex items-center justify-center text-[#00c98a]">
                    <Package size={18} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{productos.length}</div>
                <div className="text-xs font-semibold text-[#00c98a]">En catálogo</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-gray-600 font-bold text-sm">Stock Bajo</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {productos.filter((p) => p.stock < 15).length}
                </div>
                <div className="text-xs font-semibold text-red-500">Requiere atención</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-gray-600 font-bold text-sm">Categorías activas</h3>
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600">
                    <Shapes size={18} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {[...new Set(productos.map((p) => p.categoria))].length}
                </div>
                <div className="text-xs font-semibold text-gray-500">Categorías activas</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-gray-400 font-bold text-sm">Valor Total</h3>
                  <div className="w-8 h-8 rounded border border-[#00e69e] bg-white flex items-center justify-center text-[#00e69e]">
                    <Banknote size={18} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#00e69e] mb-2">
                  {formatPrecio(productos.reduce((a, p) => a + p.precio * p.stock, 0))}
                </div>
                <div className="text-xs font-semibold text-gray-500">Valor estimado del inventario</div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Inventario Actual</h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setMostrarFiltros((v) => !v)}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors ${mostrarFiltros ? 'border-[#00e69e] text-[#00c98a] bg-[#f0fff9]' : 'border-gray-900'}`}
                    >
                      <SlidersHorizontal size={16} />
                      Filtrar
                      {(filtroCategoria !== 'Todas' || filtroStock) && (
                        <span className="w-2 h-2 rounded-full bg-[#00e69e] ml-0.5" />
                      )}
                    </button>
                    {mostrarFiltros && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-20 p-4 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2">Categoría</label>
                          <select
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#00e69e] outline-none"
                          >
                            <option value="Todas">Todas</option>
                            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filtroStock}
                            onChange={(e) => setFiltroStock(e.target.checked)}
                            className="w-4 h-4 accent-[#00e69e]"
                          />
                          <span className="text-xs font-semibold text-gray-700">Solo stock bajo (&lt;15)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => { setFiltroCategoria('Todas'); setFiltroStock(false); }}
                          className="w-full text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors text-left"
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={exportarCSV}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Download size={16} />
                    Exportar CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1a1f2e] text-white text-sm">
                      <th className="py-4 px-6 font-semibold">Nombre del Producto</th>
                      <th className="py-4 px-6 font-semibold">Categoría</th>
                      <th className="py-4 px-6 font-semibold">Precio</th>
                      <th className="py-4 px-6 font-semibold">Stock</th>
                      <th className="py-4 px-6 font-semibold">Estado</th>
                      <th className="py-4 px-6 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filtrados.map((producto) => (
                      <tr key={producto.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-5 px-6 font-bold text-gray-900">
                          <div className="flex items-center gap-3">
                            <img src={producto.imagenUrl} alt={producto.nombre} className="w-10 h-10 object-contain rounded" />
                            {producto.nombre}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className="bg-[#e6fff7] text-[#00c98a] px-3 py-1 rounded-md text-xs font-bold">{producto.categoria}</span>
                        </td>
                        <td className="py-5 px-6 text-gray-600 font-medium">{formatPrecio(producto.precio)}</td>
                        <td className={`py-5 px-6 font-medium ${producto.stock < 15 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                          {producto.stock}
                        </td>
                        <td className="py-5 px-6">
                          {producto.activo === false ? (
                            <span className="flex items-center gap-2 text-orange-500 font-bold text-xs">
                              <span className="w-2 h-2 rounded-full bg-orange-400"></span>Inactivo
                            </span>
                          ) : producto.stock > 0 ? (
                            <span className="flex items-center gap-2 text-[#016b53] font-bold text-xs">
                              <span className="w-2 h-2 rounded-full bg-[#016b53]"></span>En Stock
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                              <span className="w-2 h-2 rounded-full bg-gray-400"></span>Sin Stock
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex justify-end gap-4 text-gray-500">
                            <button className="hover:text-gray-900 transition-colors" onClick={() => abrirEditar(producto)} title="Editar"><Edit2 size={16} /></button>
                            <button
                              className={`transition-colors ${producto.activo === false ? 'text-orange-400 hover:text-[#016b53]' : 'hover:text-orange-500'}`}
                              onClick={() => setConfirmarToggle(producto)}
                              title={producto.activo === false ? 'Activar producto' : 'Desactivar producto'}
                            >
                              {producto.activo === false ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button
                              className="hover:text-red-500 transition-colors"
                              onClick={() => setConfirmarEliminar(producto)}
                              title="Eliminar producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 font-medium">
                <span>Mostrando {filtrados.length} de {productos.length} productos</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 max-w-5xl mx-auto">
            {/* ADD PRODUCT VIEW */}
            <div className="flex items-center text-xs font-bold text-gray-500 mb-6 uppercase tracking-wider">
              <span className="hover:text-gray-900 cursor-pointer transition-colors" onClick={() => setIsAdding(false)}>Inventario</span>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-gray-900">{editando ? 'Editar Producto' : 'Agregar Producto'}</span>
            </div>

            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{editando ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2.5 border-2 border-gray-900 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#00e69e] hover:bg-[#00c98a] text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  {editando ? 'Guardar Cambios' : 'Guardar Producto'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Información del Producto</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Nombre del Producto</label>
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="ej., Proteína Whey 2kg"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium ${errores.nombre ? 'border-red-400' : 'border-gray-100'}`}
                      />
                      {errores.nombre && <p className="text-red-500 text-xs mt-1 font-medium">{errores.nombre}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Marca</label>
                      <select
                        name="marcaId"
                        value={form.marcaId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium"
                      >
                        <option value="">Sin marca</option>
                        {marcas.map((marca) => (
                          <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Descripción</label>
                      <textarea
                        rows={5}
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        placeholder="Descripción detallada del producto..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none resize-none font-medium"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Detalles del Producto</h2>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Precio ($)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input
                          type="number"
                          name="precioOriginal"
                          value={form.precioOriginal}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className={`w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium ${errores.precioOriginal ? 'border-red-400' : 'border-gray-100'}`}
                        />
                      </div>
                      {errores.precioOriginal && <p className="text-red-500 text-xs mt-1 font-medium">{errores.precioOriginal}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Precio con Descuento ($) <span className="text-gray-400 font-normal">(opcional)</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input
                          type="number"
                          name="precio"
                          value={form.precio}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Stock Inicial</label>
                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="0"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium ${errores.stock ? 'border-red-400' : 'border-gray-100'}`}
                      />
                      {errores.stock && <p className="text-red-500 text-xs mt-1 font-medium">{errores.stock}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Categoría</label>
                      <div className="relative">
                        <select
                          name="categoriaId"
                          value={form.categoriaId}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none appearance-none text-gray-600 font-medium"
                        >
                          <option value="">Sin categoría</option>
                          {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                      <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="w-4 h-4 accent-[#00e69e]" />
                      Producto activo
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                      <input type="checkbox" name="oferta" checked={form.oferta} onChange={handleChange} className="w-4 h-4 accent-[#00e69e]" />
                      Destacar como oferta
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Imágenes del<br/>Producto</h2>
                    <span className="bg-[#e6fff7] text-[#00c98a] px-2 py-1 rounded text-[10px] font-bold uppercase mt-1">Galería</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4 font-medium">La primera imagen es la principal. Podés agregar hasta 5 fotos (producto, tabla nutricional, etc.).</p>

                  <div className="space-y-3">
                    {form.imagenes.map((url, index) => (
                      <div key={index} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-500 flex-shrink-0">
                            {index === 0 ? 'Principal' : `Foto ${index + 1}`}
                          </span>
                          {form.imagenes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => eliminarImagenSlot(index)}
                              className="ml-auto text-red-400 hover:text-red-600 text-xs font-bold"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        {url && url !== '' && (
                          <img src={url} alt={`preview ${index}`} className="w-full h-28 object-contain rounded mb-2 bg-white border border-gray-100" />
                        )}
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => handleImagenChange(index, e.target.value)}
                          placeholder="/img/producto.png o pegar URL"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#00e69e] outline-none font-medium mb-2"
                        />
                        <label className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer flex items-center justify-center gap-1">
                          <UploadCloud size={13} />
                          Subir desde archivo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImagenFile(index, e.target.files[0])}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  {form.imagenes.length < 5 && (
                    <button
                      type="button"
                      onClick={agregarImagenSlot}
                      className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-500 hover:border-[#00e69e] hover:text-[#00c98a] transition-colors"
                    >
                      + Agregar otra imagen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal confirmación toggle activo/inactivo */}
      {confirmarToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 animate-[toast-slide-up_0.2s_ease-out]">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmarToggle.activo === false ? 'bg-green-100' : 'bg-orange-100'}`}>
                <AlertTriangle size={20} className={confirmarToggle.activo === false ? 'text-green-600' : 'text-orange-500'} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {confirmarToggle.activo === false ? 'Activar producto' : 'Desactivar producto'}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              ¿Estás seguro de que querés{' '}
              <span className="font-bold text-gray-900">
                {confirmarToggle.activo === false ? 'activar' : 'desactivar'}
              </span>{' '}
              <span className="font-bold text-gray-900">{confirmarToggle.nombre}</span>?
            </p>
            <p className="text-xs text-orange-500 font-medium mb-6">
              {confirmarToggle.activo === false
                ? 'El producto volverá a ser visible en la tienda.'
                : 'El producto dejará de aparecer en la tienda para los clientes.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarToggle(null)}
                className="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { toggleActivo(confirmarToggle.id); setConfirmarToggle(null); }}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  confirmarToggle.activo === false
                    ? 'bg-[#00e69e] hover:bg-[#00c98a] text-black'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {confirmarToggle.activo === false ? 'Sí, activar' : 'Sí, desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmación eliminar */}
      {confirmarEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 animate-[toast-slide-up_0.2s_ease-out]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Eliminar producto</h2>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              ¿Estás seguro de que querés eliminar{' '}
              <span className="font-bold text-gray-900">{confirmarEliminar.nombre}</span>?
            </p>
            <p className="text-xs text-red-500 font-medium mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const id = confirmarEliminar.id;
                  setConfirmarEliminar(null);
                  try {
                    await eliminarProducto(id);
                    mostrarToast('Producto eliminado.');
                  } catch (err) {
                    mostrarToast(err.message, 'error');
                  }
                }}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
