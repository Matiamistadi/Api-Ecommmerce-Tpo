package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.dto.UsuarioUpdateRequest;
import com.uade.tpo.ecommerce.entity.Rol;
import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

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
    public Optional<Usuario> actualizar(Long id, UsuarioUpdateRequest request) {
        return usuarioRepository.findById(id).map(u -> {
            if (request.getEmail() != null) {
                u.setEmail(request.getEmail());
            }
            if (request.getPassword() != null) {
                u.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            }
            if (request.getActivo() != null) {
                u.setActivo(request.getActivo());
            }
            // El rol NO se modifica aquí — usar cambiarRol() con privilegio ADMIN
            return usuarioRepository.save(u);
        });
    }

    @Override
    public Optional<Usuario> cambiarRol(Long id, Rol nuevoRol) {
        return usuarioRepository.findById(id).map(u -> {
            u.setRol(nuevoRol);
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
