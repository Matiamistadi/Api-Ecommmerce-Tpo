package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.ProductoDescuento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoDescuentoRepository extends JpaRepository<ProductoDescuento, Long> {
    List<ProductoDescuento> findByProductoId(Long productoId);
    List<ProductoDescuento> findByDescuentoId(Long descuentoId);
}
