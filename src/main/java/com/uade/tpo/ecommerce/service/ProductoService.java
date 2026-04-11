package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.ImagenProducto;
import com.uade.tpo.ecommerce.entity.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> obtenerTodos();
    Optional<Producto> obtenerPorId(Long id);
    List<Producto> obtenerPorCategoria(Long categoriaId);
    List<Producto> obtenerPorMarca(Long marcaId);
    Producto crear(Producto producto);
    Optional<Producto> actualizar(Long id, Producto productoActualizado);
    boolean eliminar(Long id);
    ImagenProducto agregarImagen(Long productoId, ImagenProducto imagen);
    boolean eliminarImagen(Long productoId, Long imagenId);
}
