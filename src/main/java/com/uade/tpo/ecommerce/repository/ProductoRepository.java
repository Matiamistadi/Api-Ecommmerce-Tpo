package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    
}