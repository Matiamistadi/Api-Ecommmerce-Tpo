import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, ShoppingBag } from 'lucide-react';
import './MiPerfil.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddresses } from '../context/AddressContext';

const PEDIDOS_MOCK = [
  {
    id: 1,
    nombre: 'Proteína Whey 100%',
    descripcion: 'Sabor Vainilla • 2kg',
    categoria: 'Musculación',
    fecha: '24 Oct 2023',
    estado: 'En camino',
    total: '€54.99',
    imagen: '/img/ProteVainilla.png'
  },
  {
    id: 2,
    nombre: 'Pre-Entreno Explosivo',
    descripcion: 'Sabor Sandía • 300g',
    categoria: 'Energía',
    fecha: '10 Oct 2023',
    estado: 'Entregado',
    total: '€29.50',
    imagen: '/img/PreworkSandia.png'
  }
];

const MiPerfil = () => {
  const { direccionesFormateadas, establecerPrincipal } = useAddresses();
  const [perfil, setPerfil] = useState({
    nombre: 'Atleta Élite',
    email: 'atleta@gymstore.com',
    telefono: '+34 600 000 000',
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert(`¡Cambios guardados con éxito para ${perfil.nombre}!`);
  };

  return (
    <main className="perfil">
      <div className="perfil__container">

        {/* Header con Título y Loyalty Card */}
        <header className="perfil__header">
          <div className="perfil__header-left">
            <h1 className="perfil__titulo">Mi Cuenta</h1>
            <p className="perfil__subtitulo">Gestión de perfil, pedidos y direcciones.</p>
          </div>
        </header>

        {/* Layout en Grid */}
        <div className="perfil__grid">

          {/* Columna Izquierda (Datos y Direcciones) */}
          <div className="perfil__grid-left">

            {/* Tarjeta de Datos Personales */}
            <section className="perfil__card">
              <div className="perfil__card-header">
                <User size={20} className="perfil__card-icon" />
                <h2 className="perfil__card-title">Mis Datos</h2>
              </div>

              <form onSubmit={handleSave} className="perfil__form">
                <div className="perfil__form-field">
                  <Label htmlFor="nombre" className="perfil__form-label">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    className="perfil__form-input h-auto"
                    value={perfil.nombre}
                    onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                  />
                </div>

                <div className="perfil__form-field">
                  <Label htmlFor="email" className="perfil__form-label">Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    className="perfil__form-input h-auto"
                    value={perfil.email}
                    onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                  />
                </div>

                <div className="perfil__form-field">
                  <Label htmlFor="telefono" className="perfil__form-label">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    className="perfil__form-input h-auto"
                    value={perfil.telefono}
                    onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                  />
                </div>

                <Button type="submit" className="perfil__btn-guardar-cambios h-auto">
                  Guardar Cambios
                </Button>
              </form>
            </section>

            {/* Tarjeta de Direcciones de Envío */}
            <section className="perfil__card">
              <div className="perfil__card-header">
                <MapPin size={20} className="perfil__card-icon" />
                <h2 className="perfil__card-title">Direcciones de Envío</h2>
              </div>

              {direccionesFormateadas.map((dir) => (
                <div key={dir.id} className="perfil__address-box">
                  <div className="perfil__address-header">
                    <span className="perfil__address-tag">
                      {dir.principal ? 'Principal' : 'Dirección'}
                    </span>
                    {dir.principal
                      ? <span className="perfil__address-badge">Predeterminada</span>
                      : (
                        <button
                          type="button"
                          onClick={() => establecerPrincipal(dir.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#00c98a', fontWeight: 600 }}
                        >
                          Establecer como principal
                        </button>
                      )
                    }
                  </div>
                  <p className="perfil__address-text">
                    {dir.calle} {dir.numero}{dir.piso ? `, ${dir.piso}` : ''}<br />
                    {dir.ciudad}{dir.provincia ? `, ${dir.provincia}` : ''}<br />
                    {dir.codigoPostal ? `CP ${dir.codigoPostal}` : ''}
                    {dir.referencia ? <><br /><em>{dir.referencia}</em></> : null}
                  </p>
                </div>
              ))}

              {direccionesFormateadas.length === 0 && (
                <p style={{ color: '#888', fontSize: '0.875rem', margin: '0 0 1rem' }}>Todavía no tenés direcciones guardadas.</p>
              )}

              <Link to="/agregar-direccion" style={{ textDecoration: 'none' }}>
                <Button variant="outline" className="perfil__btn-add-address h-auto">
                  + Añadir Dirección
                </Button>
              </Link>
            </section>

          </div>

          {/* Columna Derecha (Historial de Pedidos) */}
          <div className="perfil__grid-right">

            {/* Tarjeta de Pedidos */}
            <section className="perfil__card">
              <div className="perfil__card-header-with-action">
                <div className="perfil__card-header-left">
                  <ShoppingBag size={20} className="perfil__card-icon" />
                  <h2 className="perfil__card-title">Historial de Pedidos</h2>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="perfil__orders-table">
                  <thead className="perfil__orders-thead">
                    <tr className="perfil__orders-thead-tr">
                      <th>Producto</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody className="perfil__orders-tbody">
                    {PEDIDOS_MOCK.map((pedido) => (
                      <tr key={pedido.id} className="perfil__orders-row">

                        <td>
                          <div className="perfil__product-cell">
                            <div className="perfil__product-img-box">
                              <img
                                src={pedido.imagen}
                                alt={pedido.nombre}
                                className="perfil__product-img"
                              />
                            </div>
                            <div className="perfil__product-info">
                              <span className="perfil__product-name">{pedido.nombre}</span>
                              <span className="perfil__product-desc">{pedido.descripcion}</span>
                              <span className="perfil__product-badge">{pedido.categoria}</span>
                            </div>
                          </div>
                        </td>

                        <td className="perfil__date-cell">
                          {pedido.fecha}
                        </td>

                        <td>
                          <span className={`perfil__status-badge perfil__status-badge--${pedido.estado.toLowerCase().replace(' ', '-')}`}>
                            {pedido.estado === 'En camino' ? '🚚' : '✓'} {pedido.estado}
                          </span>
                        </td>

                        <td className="perfil__total-cell">
                          {pedido.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>

        </div>
      </div>
    </main>
  );
};

export default MiPerfil;
