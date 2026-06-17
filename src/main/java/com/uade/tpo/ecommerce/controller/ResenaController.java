package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Producto;
import com.uade.tpo.ecommerce.entity.Resena;
import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.repository.ProductoRepository;
import com.uade.tpo.ecommerce.repository.ResenaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos/{productoId}/resenas")
@RequiredArgsConstructor
public class ResenaController {

    private final ResenaRepository resenaRepository;
    private final ProductoRepository productoRepository;

    @GetMapping
    public ResponseEntity<List<Resena>> listar(@PathVariable Long productoId) {
        return ResponseEntity.ok(resenaRepository.findByProductoId(productoId));
    }

    @PostMapping
    public ResponseEntity<?> crear(
            @PathVariable Long productoId,
            @Valid @RequestBody Resena resena,
            @AuthenticationPrincipal Usuario usuario) {

        if (!resenaRepository.usuarioComproProducto(usuario.getId(), productoId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("mensaje", "Solo podés reseñar productos que hayas recibido"));
        }
        if (resenaRepository.findByUsuarioIdAndProductoId(usuario.getId(), productoId).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya reseñaste este producto"));
        }

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        resena.setUsuario(usuario);
        resena.setProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resenaRepository.save(resena));
    }

    @DeleteMapping("/{resenaId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long productoId,
            @PathVariable Long resenaId,
            @AuthenticationPrincipal Usuario usuario) {
        Resena resena = resenaRepository.findById(resenaId).orElse(null);
        if (resena == null) return ResponseEntity.notFound().build();
        if (!resena.getUsuario().getId().equals(usuario.getId())) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        resenaRepository.delete(resena);
        return ResponseEntity.noContent().build();
    }
}
