package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.dto.CambiarRolRequest;
import com.uade.tpo.ecommerce.dto.UsuarioUpdateRequest;
import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {
        return usuarioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualiza email, contraseña y estado — el rol NO se puede cambiar desde aquí
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest request) {
        return usuarioService.actualizar(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Solo ADMIN puede cambiar el rol de un usuario (protegido en SecurityConfig)
    @PatchMapping("/{id}/rol")
    public ResponseEntity<Usuario> cambiarRol(
            @PathVariable Long id,
            @Valid @RequestBody CambiarRolRequest request) {
        return usuarioService.cambiarRol(id, request.getRol())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        if (usuarioService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
