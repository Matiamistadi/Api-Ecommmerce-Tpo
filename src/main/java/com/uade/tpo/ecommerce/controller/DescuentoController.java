package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Descuento;
import com.uade.tpo.ecommerce.entity.ProductoDescuento;
import com.uade.tpo.ecommerce.service.DescuentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/descuentos")
public class DescuentoController {

    @Autowired
    private DescuentoService descuentoService;

    @GetMapping
    public ResponseEntity<List<Descuento>> listarDescuentos() {
        return ResponseEntity.ok(descuentoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Descuento> obtenerDescuento(@PathVariable Long id) {
        return descuentoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Descuento> crearDescuento(@RequestBody Descuento descuento) {
        return ResponseEntity.status(HttpStatus.CREATED).body(descuentoService.crear(descuento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Descuento> actualizarDescuento(@PathVariable Long id, @RequestBody Descuento descuento) {
        return descuentoService.actualizar(id, descuento)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDescuento(@PathVariable Long id) {
        if (descuentoService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/productos/{productoId}")
    public ResponseEntity<ProductoDescuento> aplicarAProducto(
            @PathVariable Long id,
            @PathVariable Long productoId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(descuentoService.aplicarAProducto(id, productoId));
    }

    @DeleteMapping("/{id}/productos/{productoId}")
    public ResponseEntity<Void> quitarDeProducto(
            @PathVariable Long id,
            @PathVariable Long productoId) {
        if (descuentoService.quitarDeProducto(id, productoId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
