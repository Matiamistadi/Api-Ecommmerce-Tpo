package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Carrito;
import com.uade.tpo.ecommerce.entity.Orden;
import com.uade.tpo.ecommerce.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/carritos")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @GetMapping("/{id}")
    public ResponseEntity<Carrito> obtenerCarrito(@PathVariable Long id) {
        return carritoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Carrito> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return carritoService.obtenerPorUsuario(usuarioId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<Carrito> crearCarrito(@PathVariable Long usuarioId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carritoService.crear(usuarioId));
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<Carrito> agregarItem(
            @PathVariable Long id,
            @RequestParam Long productoId,
            @RequestParam Integer cantidad) {
        return ResponseEntity.ok(carritoService.agregarItem(id, productoId, cantidad));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<Carrito> eliminarItem(@PathVariable Long id, @PathVariable Long itemId) {
        return ResponseEntity.ok(carritoService.eliminarItem(id, itemId));
    }

    @DeleteMapping("/{id}/vaciar")
    public ResponseEntity<Carrito> vaciarCarrito(@PathVariable Long id) {
        return ResponseEntity.ok(carritoService.vaciar(id));
    }

    // Corrección 2: confirmar el carrito crea una Orden y queda vinculada
    @PostMapping("/{id}/confirmar")
    public ResponseEntity<Orden> confirmarCarrito(
            @PathVariable Long id,
            @RequestParam Long direccionEnvioId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carritoService.confirmar(id, direccionEnvioId));
    }
}
