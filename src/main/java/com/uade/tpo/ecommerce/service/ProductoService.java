package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Producto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ProductoService {

    private final List<Producto> productos = new ArrayList<>();
    private final AtomicLong contadorId = new AtomicLong(1);

    public List<Producto> obtenerTodos() {
        return productos;
    }

    public Optional<Producto> obtenerPorId(Long id) {
        return productos.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
    }

    public Producto crear(Producto producto) {
        producto.setId(contadorId.getAndIncrement());
        productos.add(producto);
        return producto;
    }

    public boolean eliminar(Long id) {
        return productos.removeIf(p -> p.getId().equals(id));
    }

    public Optional<Producto> actualizar(Long id, Producto productoActualizado) {
    return productos.stream()
            .filter(p -> p.getId().equals(id))
            .findFirst()
            .map(p -> {
                p.setNombre(productoActualizado.getNombre());
                p.setDescripcion(productoActualizado.getDescripcion());
                p.setPrecio(productoActualizado.getPrecio());
                p.setStock(productoActualizado.getStock());
                p.setCategoria(productoActualizado.getCategoria());
                return p;
            });
}

}