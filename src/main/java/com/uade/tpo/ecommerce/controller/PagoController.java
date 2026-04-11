package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Pago;
import com.uade.tpo.ecommerce.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @GetMapping("/{id}")
    public ResponseEntity<Pago> obtenerPago(@PathVariable Long id) {
        return pagoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orden/{ordenId}")
    public ResponseEntity<Pago> obtenerPorOrden(@PathVariable Long ordenId) {
        return pagoService.obtenerPorOrden(ordenId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/orden/{ordenId}")
    public ResponseEntity<Pago> crearPago(@PathVariable Long ordenId, @RequestBody Pago pago) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pagoService.crear(ordenId, pago));
    }
}
