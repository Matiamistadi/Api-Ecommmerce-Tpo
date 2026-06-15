// Formatea un número como precio en pesos argentinos, sin centavos.
// Ej: 38000 -> "$38.000"
export function formatPrecio(valor) {
  const numero = Number(valor) || 0;
  return numero.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });
}
