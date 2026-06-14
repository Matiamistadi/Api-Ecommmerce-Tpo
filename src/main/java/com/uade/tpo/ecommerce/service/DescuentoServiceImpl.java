package com.uade.tpo.ecommerce.service;

import lombok.RequiredArgsConstructor;

import com.uade.tpo.ecommerce.entity.Descuento;
import com.uade.tpo.ecommerce.entity.Producto;
import com.uade.tpo.ecommerce.entity.ProductoDescuento;
import com.uade.tpo.ecommerce.repository.DescuentoRepository;
import com.uade.tpo.ecommerce.repository.ProductoDescuentoRepository;
import com.uade.tpo.ecommerce.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DescuentoServiceImpl implements DescuentoService {

    private final DescuentoRepository descuentoRepository;

    private final ProductoRepository productoRepository;

    private final ProductoDescuentoRepository productoDescuentoRepository;

    @Override
    public List<Descuento> obtenerTodos() {
        return descuentoRepository.findAll();
    }

    @Override
    public Optional<Descuento> obtenerPorId(Long id) {
        return descuentoRepository.findById(id);
    }

    @Override
    public Descuento crear(Descuento descuento) {
        return descuentoRepository.save(descuento);
    }

    @Override
    public Optional<Descuento> actualizar(Long id, Descuento descuentoActualizado) {
        return descuentoRepository.findById(id).map(d -> {
            d.setNombre(descuentoActualizado.getNombre());
            d.setTipo(descuentoActualizado.getTipo());
            d.setValor(descuentoActualizado.getValor());
            d.setFechaInicio(descuentoActualizado.getFechaInicio());
            d.setFechaFin(descuentoActualizado.getFechaFin());
            d.setActivo(descuentoActualizado.isActivo());
            return descuentoRepository.save(d);
        });
    }

    @Override
    public boolean eliminar(Long id) {
        if (descuentoRepository.existsById(id)) {
            descuentoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public ProductoDescuento aplicarAProducto(Long descuentoId, Long productoId) {
        Descuento descuento = descuentoRepository.findById(descuentoId)
                .orElseThrow(() -> new RuntimeException("Descuento no encontrado: " + descuentoId));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        ProductoDescuento pd = new ProductoDescuento();
        pd.setDescuento(descuento);
        pd.setProducto(producto);
        pd.setFechaAplicacion(LocalDateTime.now());
        pd.setActivo(true);
        return productoDescuentoRepository.save(pd);
    }

    @Override
    public boolean quitarDeProducto(Long descuentoId, Long productoId) {
        List<ProductoDescuento> lista = productoDescuentoRepository.findByDescuentoId(descuentoId);
        return lista.stream()
                .filter(pd -> pd.getProducto().getId().equals(productoId))
                .findFirst()
                .map(pd -> {
                    productoDescuentoRepository.delete(pd);
                    return true;
                })
                .orElse(false);
    }
}
