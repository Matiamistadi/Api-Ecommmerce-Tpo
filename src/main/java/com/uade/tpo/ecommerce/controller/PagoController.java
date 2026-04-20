package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Orden;
import com.uade.tpo.ecommerce.entity.Pago;
import com.uade.tpo.ecommerce.entity.Rol;
import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.service.OrdenService;
import com.uade.tpo.ecommerce.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @Autowired
    private OrdenService ordenService;

    private boolean esMismoUsuarioOAdmin(Long usuarioId, Usuario usuarioAutenticado) {
        return usuarioAutenticado != null
                && (usuarioAutenticado.getRol() == Rol.ADMIN || usuarioAutenticado.getId().equals(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pago> obtenerPago(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        Optional<Pago> pagoOpt = pagoService.obtenerPorId(id);
        if (pagoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!esMismoUsuarioOAdmin(pagoOpt.get().getOrden().getUsuario().getId(), usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(pagoOpt.get());
    }

    @GetMapping("/orden/{ordenId}")
    public ResponseEntity<Pago> obtenerPorOrden(
            @PathVariable Long ordenId,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        Optional<Pago> pagoOpt = pagoService.obtenerPorOrden(ordenId);
        if (pagoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!esMismoUsuarioOAdmin(pagoOpt.get().getOrden().getUsuario().getId(), usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(pagoOpt.get());
    }

    @PostMapping("/orden/{ordenId}")
    public ResponseEntity<Pago> crearPago(
            @PathVariable Long ordenId,
            @RequestBody Pago pago,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        Optional<Orden> ordenOpt = ordenService.obtenerPorId(ordenId);
        if (ordenOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!esMismoUsuarioOAdmin(ordenOpt.get().getUsuario().getId(), usuarioAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(pagoService.crear(ordenId, pago));
    }
}
