package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Direccion;
import com.uade.tpo.ecommerce.service.DireccionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios/{usuarioId}/direcciones")
@RequiredArgsConstructor
public class DireccionController {

    private final DireccionService direccionService;

    @GetMapping
    public ResponseEntity<List<Direccion>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(direccionService.obtenerPorUsuario(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Direccion> obtenerPorId(@PathVariable Long usuarioId, @PathVariable Long id) {
        return direccionService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Direccion> crear(@PathVariable Long usuarioId, @RequestBody Direccion direccion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(direccionService.crear(usuarioId, direccion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Direccion> actualizar(@PathVariable Long usuarioId,
                                                 @PathVariable Long id,
                                                 @RequestBody Direccion direccion) {
        return direccionService.actualizar(id, direccion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long usuarioId, @PathVariable Long id) {
        return direccionService.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
