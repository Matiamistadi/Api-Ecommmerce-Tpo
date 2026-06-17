package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Carrito;
import com.uade.tpo.ecommerce.entity.EstadoCarrito;
import com.uade.tpo.ecommerce.repository.CarritoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CarritoExpirationScheduler {

    private final CarritoRepository carritoRepository;
    private final CarritoServiceImpl carritoService;

    // Corre cada hora
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void limpiarCarritosExpirados() {
        List<Carrito> expirados = carritoRepository.findByEstadoAndFechaExpiracionBefore(
                EstadoCarrito.ACTIVO, LocalDateTime.now());

        for (Carrito carrito : expirados) {
            carrito.getItems().forEach(item ->
                    carritoService.devolverStock(item.getProducto(), item.getCantidad()));
            carrito.getItems().clear();
            carrito.setSubtotal(0.0);
            carrito.setEstado(EstadoCarrito.EXPIRADO);
            carritoRepository.save(carrito);
            log.info("Carrito {} expirado — stock devuelto", carrito.getId());
        }
    }
}
