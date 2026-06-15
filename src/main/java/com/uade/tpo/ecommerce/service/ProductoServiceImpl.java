package com.uade.tpo.ecommerce.service;

import lombok.RequiredArgsConstructor;

import com.uade.tpo.ecommerce.entity.ImagenProducto;
import com.uade.tpo.ecommerce.entity.Producto;
import com.uade.tpo.ecommerce.repository.ImagenProductoRepository;
import com.uade.tpo.ecommerce.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    private final ImagenProductoRepository imagenProductoRepository;

    @Override
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public List<Producto> obtenerPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @Override
    public List<Producto> obtenerPorMarca(Long marcaId) {
        return productoRepository.findByMarcaId(marcaId);
    }

    @Override
    public Producto crear(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Optional<Producto> actualizar(Long id, Producto productoActualizado) {
        return productoRepository.findById(id).map(p -> {
            p.setNombre(productoActualizado.getNombre());
            p.setDescripcion(productoActualizado.getDescripcion());
            p.setPrecio(productoActualizado.getPrecio());
            p.setPrecioOriginal(productoActualizado.getPrecioOriginal());
            p.setStock(productoActualizado.getStock());
            p.setActivo(productoActualizado.isActivo());
            p.setCategoria(productoActualizado.getCategoria());
            p.setMarca(productoActualizado.getMarca());
            p.setVendedor(productoActualizado.getVendedor());
            return productoRepository.save(p);
        });
    }

    @Override
    public Optional<Producto> toggleActivo(Long id) {
        return productoRepository.findById(id).map(p -> {
            p.setActivo(!p.isActivo());
            return productoRepository.save(p);
        });
    }

    @Override
    public boolean eliminar(Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public ImagenProducto agregarImagen(Long productoId, ImagenProducto imagen) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));
        imagen.setProducto(producto);
        return imagenProductoRepository.save(imagen);
    }

    @Override
    public boolean eliminarImagen(Long productoId, Long imagenId) {
        return imagenProductoRepository.findById(imagenId)
                .filter(img -> img.getProducto().getId().equals(productoId))
                .map(img -> {
                    imagenProductoRepository.delete(img);
                    return true;
                })
                .orElse(false);
    }
}
