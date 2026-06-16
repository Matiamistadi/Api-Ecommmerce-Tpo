package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.ItemOrden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemOrdenRepository extends JpaRepository<ItemOrden, Long> {
    List<ItemOrden> findByOrdenId(Long ordenId);

    // Para saber si un producto está en alguna orden (no se debe borrar si es así)
    boolean existsByProductoId(Long productoId);
}
