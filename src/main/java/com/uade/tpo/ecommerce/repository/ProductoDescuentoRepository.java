package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.ProductoDescuento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoDescuentoRepository extends JpaRepository<ProductoDescuento, Long> {
    List<ProductoDescuento> findByProductoId(Long productoId);
    List<ProductoDescuento> findByDescuentoId(Long descuentoId);
}
