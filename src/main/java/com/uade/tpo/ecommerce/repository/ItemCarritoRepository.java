package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.ItemCarrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    List<ItemCarrito> findByCarritoId(Long carritoId);

    // Para poder eliminar un producto: primero lo sacamos de los carritos.
    // DELETE bulk (no carga el grafo Carrito→items, que es EAGER y rompería el flush).
    @Modifying
    @Query("DELETE FROM ItemCarrito ic WHERE ic.producto.id = :productoId")
    void deleteByProductoId(@Param("productoId") Long productoId);
}
