package com.uade.tpo.ecommerce.service;

import lombok.RequiredArgsConstructor;

import com.uade.tpo.ecommerce.entity.ImagenProducto;
import com.uade.tpo.ecommerce.entity.Producto;
import com.uade.tpo.ecommerce.repository.ImagenProductoRepository;
import com.uade.tpo.ecommerce.repository.ItemCarritoRepository;
import com.uade.tpo.ecommerce.repository.ItemOrdenRepository;
import com.uade.tpo.ecommerce.repository.ProductoDescuentoRepository;
import com.uade.tpo.ecommerce.repository.ProductoRepository;
import com.uade.tpo.ecommerce.repository.ResenaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    private final ImagenProductoRepository imagenProductoRepository;

    private final ItemCarritoRepository itemCarritoRepository;

    private final ItemOrdenRepository itemOrdenRepository;

    private final ResenaRepository resenaRepository;

    private final ProductoDescuentoRepository productoDescuentoRepository;

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
    @Transactional
    public boolean eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            return false;
        }

        // Si el producto está en alguna orden, NO lo borramos (hay que conservar el historial)
        if (itemOrdenRepository.existsByProductoId(id)) {
            throw new IllegalStateException(
                    "No se puede eliminar: el producto tiene pedidos asociados. Desactivalo en su lugar.");
        }

        // Limpiamos las referencias que no son historial de ventas (FK sin cascade):
        // los carritos son temporales, y las reseñas/descuentos pierden sentido sin el producto.
        itemCarritoRepository.deleteByProductoId(id);
        resenaRepository.deleteByProductoId(id);
        productoDescuentoRepository.deleteByProductoId(id);
        productoRepository.deleteById(id);
        return true;
    }

    @Override
    public ImagenProducto agregarImagen(Long productoId, MultipartFile archivo) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo de imagen está vacío");
        }

        try {
            // 1) Carpeta uploads/ (se crea si no existe)
            Path carpeta = Paths.get("uploads");
            Files.createDirectories(carpeta);

            // 2) Nombre único para no pisar archivos con el mismo nombre
            String original = StringUtils.cleanPath(
                    archivo.getOriginalFilename() == null ? "imagen" : archivo.getOriginalFilename());
            String nombreArchivo = UUID.randomUUID() + "_" + original;

            // 3) Guardamos el archivo físicamente en disco
            Path destino = carpeta.resolve(nombreArchivo);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

                // 4) Guardamos una ruta relativa para no depender del host/puerto del backend
                String url = "/uploads/" + nombreArchivo;

            // 5) Guardamos la imagen asociada al producto
            ImagenProducto imagen = new ImagenProducto();
            imagen.setUrl(url);
            imagen.setProducto(producto);
            return imagenProductoRepository.save(imagen);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen: " + e.getMessage(), e);
        }
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
