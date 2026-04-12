package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Direccion;

import java.util.List;
import java.util.Optional;

public interface DireccionService {
    List<Direccion> obtenerPorUsuario(Long usuarioId);
    Optional<Direccion> obtenerPorId(Long id);
    Direccion crear(Long usuarioId, Direccion direccion);
    Optional<Direccion> actualizar(Long id, Direccion direccionActualizada);
    boolean eliminar(Long id);
}
