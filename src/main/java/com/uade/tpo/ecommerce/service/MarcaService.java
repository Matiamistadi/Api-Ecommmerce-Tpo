package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Marca;

import java.util.List;
import java.util.Optional;

public interface MarcaService {
    List<Marca> obtenerTodas();
    Optional<Marca> obtenerPorId(Long id);
    Marca crear(Marca marca);
    Optional<Marca> actualizar(Long id, Marca marcaActualizada);
    boolean eliminar(Long id);
}
