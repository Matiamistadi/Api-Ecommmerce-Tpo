import { createContext, useContext, useMemo, useState } from 'react';
import { clientesIniciales, pedidosIniciales } from '../data/commerceMockData';

const CommerceContext = createContext();

const generarIdPedido = () => `#GS-${Math.floor(10000 + Math.random() * 90000)}`;

export const CommerceProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [clientes, setClientes] = useState(clientesIniciales);

  const registrarPedido = ({ clienteNombre, clienteEmail, items, total, direccion }) => {
    const cantidadProductos = items.reduce((acc, item) => acc + item.cantidad, 0);
    const nuevoPedido = {
      id: generarIdPedido(),
      cliente: clienteNombre || clienteEmail || 'Cliente',
      email: clienteEmail || '',
      fecha: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
      total,
      cantidadProductos,
      estado: 'Pendiente',
      items: items.map((item) => ({
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
      direccion,
    };

    setPedidos((prev) => [nuevoPedido, ...prev]);

    if (!clienteEmail) return nuevoPedido;

    setClientes((prev) => {
      const existente = prev.find((cliente) => cliente.email.toLowerCase() === clienteEmail.toLowerCase());

      if (!existente) {
        return [
          {
            id: Date.now(),
            nombre: clienteNombre?.split(' ')[0] || 'Cliente',
            apellido: clienteNombre?.split(' ').slice(1).join(' ') || 'Nuevo',
            email: clienteEmail,
            estado: 'Activo',
            pedidos: 1,
            ultimaCompra: nuevoPedido.fecha,
            totalGastado: total,
          },
          ...prev,
        ];
      }

      return prev.map((cliente) => {
        if (cliente.email.toLowerCase() !== clienteEmail.toLowerCase()) return cliente;

        return {
          ...cliente,
          pedidos: cliente.pedidos + 1,
          ultimaCompra: nuevoPedido.fecha,
          totalGastado: parseFloat((cliente.totalGastado + total).toFixed(2)),
          estado: 'Activo',
        };
      });
    });

    return nuevoPedido;
  };

  const cambiarEstadoPedido = (id, estado) => {
    setPedidos((prev) => prev.map((pedido) => (pedido.id === id ? { ...pedido, estado } : pedido)));
  };

  const cambiarEstadoCliente = (id, estado) => {
    setClientes((prev) => prev.map((cliente) => (cliente.id === id ? { ...cliente, estado } : cliente)));
  };

  const metrics = useMemo(() => ({
    totalPedidos: pedidos.length,
    pedidosActivos: pedidos.filter((pedido) => ['Activo', 'Pendiente'].includes(pedido.estado)).length,
    pedidosPendientes: pedidos.filter((pedido) => pedido.estado === 'Pendiente').length,
    pedidosCancelados: pedidos.filter((pedido) => pedido.estado === 'Cancelado').length,
    ingresosEstimados: pedidos.reduce((acc, pedido) => acc + pedido.total, 0),
    totalClientes: clientes.length,
    clientesActivos: clientes.filter((cliente) => cliente.estado === 'Activo').length,
    clientesSuspendidos: clientes.filter((cliente) => cliente.estado !== 'Activo').length,
    clientesRecientes: clientes.filter((cliente) => cliente.ultimaCompra).length,
    promedioPedidos: clientes.length ? pedidos.length / clientes.length : 0,
  }), [clientes, pedidos]);

  return (
    <CommerceContext.Provider value={{
      pedidos,
      clientes,
      metrics,
      registrarPedido,
      cambiarEstadoPedido,
      cambiarEstadoCliente,
    }}>
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => useContext(CommerceContext);
