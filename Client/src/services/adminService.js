import { getTodasLasOrdenes } from './ordenService';
import { getUsuarios } from './usuarioService';

// Métricas en cero, para inicializar el estado antes de que llegue la respuesta
export const METRICS_VACIAS = {
  totalPedidos: 0,
  pedidosActivos: 0,
  pedidosPendientes: 0,
  pedidosCancelados: 0,
  ingresosEstimados: 0,
  totalClientes: 0,
  clientesActivos: 0,
  clientesSuspendidos: 0,
  clientesRecientes: 0,
  promedioPedidos: 0,
};

// Enriquece cada usuario con sus estadísticas de compra (sacadas de las órdenes)
function construirClientes(usuarios, pedidos) {
  return usuarios.map((u) => {
    const ordenesDelCliente = pedidos.filter((p) => p.email === u.email);
    const totalGastado = ordenesDelCliente.reduce((acc, p) => acc + p.total, 0);
    // Los usuarios no guardan nombre; usamos el nombre de envío de alguna orden, o el mail
    const nombreEnvio = ordenesDelCliente.find((p) => p.cliente && p.cliente !== u.email)?.cliente;

    return {
      id: u.id,
      nombre: nombreEnvio || u.email.split('@')[0],
      apellido: '',
      email: u.email,
      estado: u.activo ? 'Activo' : 'Suspendido',
      pedidos: ordenesDelCliente.length,
      ultimaCompra: ordenesDelCliente.at(-1)?.fecha || '—',
      totalGastado,
      rol: u.rol,
    };
  });
}

function construirMetrics(pedidos, clientes) {
  const activos = pedidos.filter((p) => ['PENDIENTE', 'APROBADO', 'ENVIADO'].includes(p.estado));
  const cancelados = pedidos.filter((p) => ['RECHAZADO', 'CANCELADO'].includes(p.estado));
  const pendientes = pedidos.filter((p) => p.estado === 'PENDIENTE');
  const ingresos = pedidos
    .filter((p) => !['RECHAZADO', 'CANCELADO'].includes(p.estado))
    .reduce((acc, p) => acc + p.total, 0);

  return {
    totalPedidos: pedidos.length,
    pedidosActivos: activos.length,
    pedidosPendientes: pendientes.length,
    pedidosCancelados: cancelados.length,
    ingresosEstimados: ingresos,
    totalClientes: clientes.length,
    clientesActivos: clientes.filter((c) => c.estado === 'Activo').length,
    clientesSuspendidos: clientes.filter((c) => c.estado === 'Suspendido').length,
    clientesRecientes: clientes.filter((c) => c.pedidos > 0).length,
    promedioPedidos: clientes.length ? pedidos.length / clientes.length : 0,
  };
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Suma las ventas (órdenes no canceladas) de cada uno de los últimos 6 meses
function construirVentasMensuales(pedidos) {
  const ahora = new Date();
  const resultado = [];

  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth();

    const ventas = pedidos
      .filter((p) => p.fechaRaw && !['RECHAZADO', 'CANCELADO'].includes(p.estado))
      .filter((p) => {
        const d = new Date(p.fechaRaw);
        return d.getFullYear() === anio && d.getMonth() === mes;
      })
      .reduce((acc, p) => acc + p.total, 0);

    resultado.push({ mes: MESES[mes], ventas });
  }

  return resultado;
}

// Trae órdenes y usuarios EN PARALELO (Promise.all) y arma el resumen del admin
export async function getResumenAdmin() {
  const [pedidos, usuarios] = await Promise.all([getTodasLasOrdenes(), getUsuarios()]);
  const clientes = construirClientes(usuarios, pedidos);
  const metrics = construirMetrics(pedidos, clientes);
  const ventasMensuales = construirVentasMensuales(pedidos);
  return { pedidos, clientes, metrics, ventasMensuales };
}
