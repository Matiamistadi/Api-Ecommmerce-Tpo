package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Configuracion;
import com.uade.tpo.ecommerce.service.ConfiguracionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion")
@RequiredArgsConstructor
public class ConfiguracionController {

    private final ConfiguracionService configuracionService;

    // Público: la página de Contacto necesita el email/teléfono de la tienda
    @GetMapping
    public ResponseEntity<Configuracion> obtener() {
        return ResponseEntity.ok(configuracionService.obtener());
    }

    // Solo ADMIN puede cambiar la configuración
    @PutMapping
    public ResponseEntity<Configuracion> actualizar(@RequestBody Configuracion datos) {
        return ResponseEntity.ok(configuracionService.actualizar(datos));
    }
}
