package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.EstadoOrden;
import com.uade.tpo.ecommerce.entity.Orden;
import com.uade.tpo.ecommerce.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenServiceImpl implements OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    @Override
    public List<Orden> obtenerTodas() {
        return ordenRepository.findAll();
    }

    @Override
    public Optional<Orden> obtenerPorId(Long id) {
        return ordenRepository.findById(id);
    }

    @Override
    public List<Orden> obtenerPorUsuario(Long usuarioId) {
        return ordenRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public Optional<Orden> actualizarEstado(Long id, EstadoOrden nuevoEstado) {
        return ordenRepository.findById(id).map(o -> {
            o.setEstado(nuevoEstado);
            return ordenRepository.save(o);
        });
    }
}
