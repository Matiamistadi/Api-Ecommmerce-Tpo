package com.uade.tpo.ecommerce.repository;

import com.uade.tpo.ecommerce.entity.Carrito;
import com.uade.tpo.ecommerce.entity.EstadoCarrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuarioId(Long usuarioId);
    List<Carrito> findByEstadoAndFechaExpiracionBefore(EstadoCarrito estado, LocalDateTime fecha);
}
