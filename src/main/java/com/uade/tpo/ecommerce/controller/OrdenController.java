package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.EstadoOrden;
import com.uade.tpo.ecommerce.entity.Orden;
import com.uade.tpo.ecommerce.service.OrdenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @GetMapping
    public ResponseEntity<List<Orden>> listarOrdenes() {
        return ResponseEntity.ok(ordenService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orden> obtenerOrden(@PathVariable Long id) {
        return ordenService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Orden>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(ordenService.obtenerPorUsuario(usuarioId));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Orden> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        EstadoOrden nuevoEstado = EstadoOrden.valueOf(body.get("estado"));
        return ordenService.actualizarEstado(id, nuevoEstado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
