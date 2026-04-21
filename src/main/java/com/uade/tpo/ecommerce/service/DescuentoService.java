package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Descuento;
import com.uade.tpo.ecommerce.entity.ProductoDescuento;

import java.util.List;
import java.util.Optional;

public interface DescuentoService {
    List<Descuento> obtenerTodos();
    Optional<Descuento> obtenerPorId(Long id);
    Descuento crear(Descuento descuento);
    Optional<Descuento> actualizar(Long id, Descuento descuentoActualizado);
    boolean eliminar(Long id);
    ProductoDescuento aplicarAProducto(Long descuentoId, Long productoId);
    boolean quitarDeProducto(Long descuentoId, Long productoId);
}
