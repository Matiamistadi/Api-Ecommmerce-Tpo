package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.EstadoOrden;
import com.uade.tpo.ecommerce.entity.Orden;

import java.util.List;
import java.util.Optional;

public interface OrdenService {
    List<Orden> obtenerTodas();
    Optional<Orden> obtenerPorId(Long id);
    List<Orden> obtenerPorUsuario(Long usuarioId);
    Optional<Orden> actualizarEstado(Long id, EstadoOrden nuevoEstado);
}
