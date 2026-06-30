package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByProductoId(Long productoId);
    Optional<Resena> findByUsuarioIdAndProductoId(Long usuarioId, Long productoId);

    // Para poder eliminar un producto: primero borramos sus reseñas (DELETE bulk)
    @Modifying
    @Query("DELETE FROM Resena r WHERE r.producto.id = :productoId")
    void deleteByProductoId(@Param("productoId") Long productoId);

    @Query("SELECT COUNT(io) > 0 FROM ItemOrden io WHERE io.orden.usuario.id = :usuarioId AND io.producto.id = :productoId AND io.orden.estado = com.uade.tpo.ecommerce.entity.EstadoOrden.ENTREGADO")
    boolean usuarioComproProducto(Long usuarioId, Long productoId);
}
