package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoriaId(Long categoriaId);
    List<Producto> findByMarcaId(Long marcaId);
    List<Producto> findByVendedorId(Long vendedorId);
}
