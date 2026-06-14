package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.ItemOrden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemOrdenRepository extends JpaRepository<ItemOrden, Long> {
    List<ItemOrden> findByOrdenId(Long ordenId);
}
