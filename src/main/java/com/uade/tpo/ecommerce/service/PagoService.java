package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Pago;

import java.util.Optional;

public interface PagoService {
    Optional<Pago> obtenerPorId(Long id);
    Optional<Pago> obtenerPorOrden(Long ordenId);
    Pago crear(Long ordenId, Pago pago);
}
