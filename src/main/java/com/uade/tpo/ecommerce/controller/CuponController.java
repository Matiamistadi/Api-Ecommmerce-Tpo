package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Cupon;
import com.uade.tpo.ecommerce.service.CuponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cupones")
@RequiredArgsConstructor
public class CuponController {

    private final CuponService cuponService;

    @GetMapping
    public ResponseEntity<List<Cupon>> listar() {
        return ResponseEntity.ok(cuponService.listar());
    }

    @PostMapping
    public ResponseEntity<Cupon> crear(@Valid @RequestBody Cupon cupon) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cuponService.crear(cupon));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cupon> actualizar(@PathVariable Long id, @RequestBody Cupon datos) {
        return ResponseEntity.ok(cuponService.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        cuponService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /** Endpoint público: valida un código y devuelve el descuento calculado */
    @GetMapping("/validar")
    public ResponseEntity<Map<String, Object>> validar(
            @RequestParam String codigo,
            @RequestParam double subtotal) {
        return ResponseEntity.ok(cuponService.validar(codigo, subtotal));
    }

    /** Registra el uso del cupón al confirmar la compra */
    @PostMapping("/aplicar")
    public ResponseEntity<Void> aplicar(@RequestParam String codigo) {
        cuponService.aplicar(codigo);
        return ResponseEntity.noContent().build();
    }
}
