package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Carrito;
import com.uade.tpo.ecommerce.entity.Orden;

import java.util.Optional;

public interface CarritoService {
    Optional<Carrito> obtenerPorId(Long id);
    Optional<Carrito> obtenerPorUsuario(Long usuarioId);
    Carrito crear(Long usuarioId);
    Carrito agregarItem(Long carritoId, Long productoId, Integer cantidad);
    Carrito eliminarItem(Long carritoId, Long itemId);
    Carrito vaciar(Long carritoId);
    // Corrección 2: confirmar carrito crea una Orden y la vincula al Carrito
    Orden confirmar(Long carritoId, Long direccionEnvioId);
}
