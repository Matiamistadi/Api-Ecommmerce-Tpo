package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Categoria;

import java.util.List;
import java.util.Optional;

public interface CategoriaService {
    List<Categoria> obtenerTodas();
    Optional<Categoria> obtenerPorId(Long id);
    Categoria crear(Categoria categoria);
    Optional<Categoria> actualizar(Long id, Categoria categoriaActualizada);
    boolean eliminar(Long id);
}
