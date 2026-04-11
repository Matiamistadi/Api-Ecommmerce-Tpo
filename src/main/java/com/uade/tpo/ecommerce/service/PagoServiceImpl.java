package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.EstadoPago;
import com.uade.tpo.ecommerce.entity.Orden;
import com.uade.tpo.ecommerce.entity.Pago;
import com.uade.tpo.ecommerce.repository.OrdenRepository;
import com.uade.tpo.ecommerce.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PagoServiceImpl implements PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private OrdenRepository ordenRepository;

    @Override
    public Optional<Pago> obtenerPorId(Long id) {
        return pagoRepository.findById(id);
    }

    @Override
    public Optional<Pago> obtenerPorOrden(Long ordenId) {
        return pagoRepository.findByOrdenId(ordenId);
    }

    @Override
    public Pago crear(Long ordenId, Pago pago) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada: " + ordenId));
        pago.setOrden(orden);
        pago.setEstado(EstadoPago.PENDIENTE);
        return pagoRepository.save(pago);
    }
}
