package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<Usuario> obtenerTodos();
    Optional<Usuario> obtenerPorId(Long id);
    Optional<Usuario> obtenerPorEmail(String email);
    Usuario crear(Usuario usuario);
    Optional<Usuario> actualizar(Long id, Usuario usuarioActualizado);
    boolean eliminar(Long id);
}
