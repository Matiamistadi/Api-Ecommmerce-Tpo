package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.Marca;
import com.uade.tpo.ecommerce.service.MarcaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    @Autowired
    private MarcaService marcaService;

    @GetMapping
    public ResponseEntity<List<Marca>> listarMarcas() {
        return ResponseEntity.ok(marcaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marca> obtenerMarca(@PathVariable Long id) {
        return marcaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Marca> crearMarca(@RequestBody Marca marca) {
        return ResponseEntity.status(HttpStatus.CREATED).body(marcaService.crear(marca));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca> actualizarMarca(@PathVariable Long id, @RequestBody Marca marca) {
        return marcaService.actualizar(id, marca)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMarca(@PathVariable Long id) {
        if (marcaService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
