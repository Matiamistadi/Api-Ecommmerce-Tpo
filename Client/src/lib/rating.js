// Rating "estable" derivado del id del producto.
// Es visual (todavía no hay backend de reseñas), pero siempre da el mismo
// valor para el mismo producto, así no parece aleatorio.
export function getRating(id = 0) {
  const estrellas = 3.6 + ((id * 7) % 14) / 10; // entre 3.6 y 5.0
  const opiniones = 12 + ((id * 13) % 230); // entre 12 y 241
  return { estrellas: Math.min(5, Number(estrellas.toFixed(1))), opiniones };
}
