package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Rol;
import com.uade.tpo.ecommerce.entity.Direccion;
import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.service.DireccionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios/{usuarioId}/direcciones")
@RequiredArgsConstructor
public class DireccionController {

    private final DireccionService direccionService;

    private boolean esMismoUsuarioOAdmin(Long usuarioId, Usuario usuarioAutenticado) {
        return usuarioAutenticado != null
                && (usuarioAutenticado.getRol() == Rol.ADMIN || usuarioAutenticado.getId().equals(usuarioId));
    }

    @GetMapping
    public ResponseEntity<List<Direccion>> obtenerPorUsuario(
            @PathVariable Long usuarioId,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (!esMismoUsuarioOAdmin(usuarioId, usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(direccionService.obtenerPorUsuario(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Direccion> obtenerPorId(
            @PathVariable Long usuarioId,
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (!esMismoUsuarioOAdmin(usuarioId, usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Direccion> direccionOpt = direccionService.obtenerPorId(id);
        if (direccionOpt.isEmpty() || !direccionOpt.get().getUsuario().getId().equals(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(direccionOpt.get());
    }

    @PostMapping
    public ResponseEntity<Direccion> crear(
            @PathVariable Long usuarioId,
            @RequestBody Direccion direccion,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (!esMismoUsuarioOAdmin(usuarioId, usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(direccionService.crear(usuarioId, direccion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Direccion> actualizar(@PathVariable Long usuarioId,
                                                 @PathVariable Long id,
                                                 @RequestBody Direccion direccion,
                                                 @AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (!esMismoUsuarioOAdmin(usuarioId, usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Direccion> direccionOpt = direccionService.obtenerPorId(id);
        if (direccionOpt.isEmpty() || !direccionOpt.get().getUsuario().getId().equals(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        return direccionService.actualizar(id, direccion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long usuarioId,
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (!esMismoUsuarioOAdmin(usuarioId, usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Direccion> direccionOpt = direccionService.obtenerPorId(id);
        if (direccionOpt.isEmpty() || !direccionOpt.get().getUsuario().getId().equals(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        return direccionService.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
