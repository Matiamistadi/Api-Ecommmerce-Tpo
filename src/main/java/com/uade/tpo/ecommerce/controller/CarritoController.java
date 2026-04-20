package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Carrito;
import com.uade.tpo.ecommerce.entity.Orden;
import com.uade.tpo.ecommerce.entity.Rol;
import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;



@RestController
@RequestMapping("/api/carritos")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    private boolean esMismoUsuarioOAdmin(Long usuarioId, Usuario usuarioAutenticado) {
        return usuarioAutenticado != null
                && (usuarioAutenticado.getRol() == Rol.ADMIN || usuarioAutenticado.getId().equals(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carrito> obtenerCarrito(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        Optional<Carrito> carritoOpt = carritoService.obtenerPorId(id);
        if (carritoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Carrito carrito = carritoOpt.get();
        if (!esMismoUsuarioOAdmin(carrito.getUsuario().getId(), usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(carrito);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Carrito> obtenerPorUsuario(
            @PathVariable Long usuarioId,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (!esMismoUsuarioOAdmin(usuarioId, usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return carritoService.obtenerPorUsuario(usuarioId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<Carrito> crearCarrito(
            @PathVariable Long usuarioId,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (!esMismoUsuarioOAdmin(usuarioId, usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(carritoService.crear(usuarioId));
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<Carrito> agregarItem(
            @PathVariable Long id,
            @RequestParam Long productoId,
            @RequestParam Integer cantidad,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        Optional<Carrito> carritoOpt = carritoService.obtenerPorId(id);
        if (carritoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!esMismoUsuarioOAdmin(carritoOpt.get().getUsuario().getId(), usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(carritoService.agregarItem(id, productoId, cantidad));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<Carrito> eliminarItem(
            @PathVariable Long id,
            @PathVariable Long itemId,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        Optional<Carrito> carritoOpt = carritoService.obtenerPorId(id);
        if (carritoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!esMismoUsuarioOAdmin(carritoOpt.get().getUsuario().getId(), usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(carritoService.eliminarItem(id, itemId));
    }

    @DeleteMapping("/{id}/vaciar")
    public ResponseEntity<Carrito> vaciarCarrito(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        Optional<Carrito> carritoOpt = carritoService.obtenerPorId(id);
        if (carritoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!esMismoUsuarioOAdmin(carritoOpt.get().getUsuario().getId(), usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(carritoService.vaciar(id));
    }

    // Corrección 2: confirmar el carrito crea una Orden y queda vinculada
    @PostMapping("/{id}/confirmar")
    public ResponseEntity<Orden> confirmarCarrito(
            @PathVariable Long id,
            @RequestParam Long direccionEnvioId,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        Optional<Carrito> carritoOpt = carritoService.obtenerPorId(id);
        if (carritoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!esMismoUsuarioOAdmin(carritoOpt.get().getUsuario().getId(), usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(carritoService.confirmar(id, direccionEnvioId));
    }
}
