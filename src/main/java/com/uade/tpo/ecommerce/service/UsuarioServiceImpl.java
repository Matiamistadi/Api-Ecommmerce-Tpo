package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Optional<Usuario> obtenerPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public Usuario crear(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> actualizar(Long id, Usuario usuarioActualizado) {
        return usuarioRepository.findById(id).map(u -> {
            u.setEmail(usuarioActualizado.getEmail());
            u.setPasswordHash(usuarioActualizado.getPasswordHash());
            u.setRol(usuarioActualizado.getRol());
            u.setActivo(usuarioActualizado.isActivo());
            return usuarioRepository.save(u);
        });
    }

    @Override
    public boolean eliminar(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
