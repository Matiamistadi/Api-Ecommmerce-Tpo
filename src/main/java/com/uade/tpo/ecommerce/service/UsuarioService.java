package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.dto.UsuarioUpdateRequest;
import com.uade.tpo.ecommerce.entity.Rol;
import com.uade.tpo.ecommerce.entity.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<Usuario> obtenerTodos();
    Optional<Usuario> obtenerPorId(Long id);
    Optional<Usuario> obtenerPorEmail(String email);
    Optional<Usuario> actualizar(Long id, UsuarioUpdateRequest request);
    Optional<Usuario> cambiarRol(Long id, Rol nuevoRol);
    boolean eliminar(Long id);
}
