package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoriaId(Long categoriaId);
    List<Producto> findByMarcaId(Long marcaId);
    List<Producto> findByVendedorId(Long vendedorId);
}
