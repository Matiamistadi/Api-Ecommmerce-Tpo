package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> obtenerTodos();
    Optional<Producto> obtenerPorId(Long id);
    Producto crear(Producto producto);
    boolean eliminar(Long id);
    Optional<Producto> actualizar(Long id, Producto productoActualizado);
}
