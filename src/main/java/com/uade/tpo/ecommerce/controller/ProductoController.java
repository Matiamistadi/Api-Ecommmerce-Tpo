package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.entity.ImagenProducto;
import com.uade.tpo.ecommerce.entity.Producto;
import com.uade.tpo.ecommerce.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        return ResponseEntity.ok(productoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        return productoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> obtenerPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(productoService.obtenerPorCategoria(categoriaId));
    }

    @GetMapping("/marca/{marcaId}")
    public ResponseEntity<List<Producto>> obtenerPorMarca(@PathVariable Long marcaId) {
        return ResponseEntity.ok(productoService.obtenerPorMarca(marcaId));
    }

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        return productoService.actualizar(id, producto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        if (productoService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Corrección 3: gestión de imágenes
    @PostMapping("/{id}/imagenes")
    public ResponseEntity<ImagenProducto> agregarImagen(@PathVariable Long id, @RequestBody ImagenProducto imagen) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.agregarImagen(id, imagen));
    }

    @DeleteMapping("/{productoId}/imagenes/{imagenId}")
    public ResponseEntity<Void> eliminarImagen(@PathVariable Long productoId, @PathVariable Long imagenId) {
        if (productoService.eliminarImagen(productoId, imagenId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
