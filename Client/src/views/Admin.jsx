import { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { AdminSidebar } from '../components/AdminSidebar';
import {
  Search, Plus, SlidersHorizontal, Download, Edit2, Trash2,
  Package, Shapes, Banknote, ChevronRight, UploadCloud, ChevronDown
} from 'lucide-react';

const Admin = () => {
  const { productos } = useProducts();
  const [busqueda, setBusqueda] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filtrados = productos.filter((producto) => (
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    || producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
    || producto.marca.toLowerCase().includes(busqueda.toLowerCase())
  ));

  const handleSave = () => {
    alert('Producto guardado!');
    setIsAdding(false);
  };

  return (
    <div className="flex h-full bg-[#fafafa] font-sans w-full">
      <AdminSidebar onAddClick={() => setIsAdding(true)} />

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
                  onClick={() => setIsAdding(true)}
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
                  ${productos.reduce((a, p) => a + p.precio * p.stock, 0).toFixed(0)}
                </div>
                <div className="text-xs font-semibold text-gray-500">Valor estimado del inventario</div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Inventario Actual</h2>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                    <SlidersHorizontal size={16} />
                    Filtrar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                    <Download size={16} />
                    Exportar
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1a1f2e] text-white text-sm">
                      <th className="py-4 px-6 w-12"><input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-transparent" /></th>
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
                        <td className="py-5 px-6"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                        <td className="py-5 px-6 font-bold text-gray-900">
                          <div className="flex items-center gap-3">
                            <img src={producto.imagenUrl} alt={producto.nombre} className="w-10 h-10 object-contain rounded" />
                            {producto.nombre}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className="bg-[#e6fff7] text-[#00c98a] px-3 py-1 rounded-md text-xs font-bold">{producto.categoria}</span>
                        </td>
                        <td className="py-5 px-6 text-gray-600 font-medium">${producto.precio.toFixed(2)}</td>
                        <td className={`py-5 px-6 font-medium ${producto.stock < 15 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                          {producto.stock}
                        </td>
                        <td className="py-5 px-6">
                          {producto.stock > 0 ? (
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
                            <button className="hover:text-gray-900 transition-colors"><Edit2 size={16} /></button>
                            <button className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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
              <span className="text-gray-900">Agregar Producto</span>
            </div>

            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Agregar Nuevo Producto</h1>
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
                  Guardar Producto
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
                        placeholder="ej., Barra Olímpica 20kg"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Descripción</label>
                      <textarea
                        rows={5}
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
                      <label className="block text-sm font-bold text-gray-900 mb-2">Precio Base ($)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input
                          type="text"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Nivel de Stock Inicial</label>
                      <input
                        type="text"
                        placeholder="0"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Categoría</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#00e69e] outline-none appearance-none text-gray-600 font-medium">
                        <option>Selecciona una categoría</option>
                        <option>Suplementos</option>
                        <option>Equipamiento</option>
                        <option>Ropa</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Multimedia del<br/>Producto</h2>
                    <span className="bg-[#e6fff7] text-[#00c98a] px-2 py-1 rounded text-[10px] font-bold uppercase mt-1">Obligatorio</span>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-100">
                      <UploadCloud size={20} className="text-gray-900" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm leading-tight">Haz clic para subir o<br/>arrastra y suelta</h3>
                    <p className="text-xs text-gray-500 mb-6 font-medium">SVG, PNG, JPG or GIF<br/>(max. 800x400px)</p>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors text-gray-700 shadow-sm">
                      Buscar Archivos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
