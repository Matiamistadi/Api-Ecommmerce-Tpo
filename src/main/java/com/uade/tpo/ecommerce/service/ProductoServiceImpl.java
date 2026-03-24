package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Producto;
import com.uade.tpo.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepository;


    ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }


    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }

    public Producto crear(Producto producto) {
        return productoRepository.save(producto);
    }

    public boolean eliminar(Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Producto> actualizar(Long id, Producto productoActualizado) {
        return productoRepository.findById(id)
            .map(p -> {
                p.setNombre(productoActualizado.getNombre());
                p.setDescripcion(productoActualizado.getDescripcion());
                p.setPrecio(productoActualizado.getPrecio());
                p.setStock(productoActualizado.getStock());
                p.setCategoria(productoActualizado.getCategoria());
                return productoRepository.save(p);
            });
}

}