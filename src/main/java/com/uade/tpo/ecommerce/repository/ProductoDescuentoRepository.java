package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.ProductoDescuento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductoDescuentoRepository extends JpaRepository<ProductoDescuento, Long> {
    List<ProductoDescuento> findByProductoId(Long productoId);
    List<ProductoDescuento> findByDescuentoId(Long descuentoId);

    // Para poder eliminar un producto: primero borramos sus asociaciones con descuentos (DELETE bulk)
    @Modifying
    @Query("DELETE FROM ProductoDescuento pd WHERE pd.producto.id = :productoId")
    void deleteByProductoId(@Param("productoId") Long productoId);
}
