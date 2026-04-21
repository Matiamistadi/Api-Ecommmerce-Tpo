package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Marca;
import com.uade.tpo.ecommerce.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarcaServiceImpl implements MarcaService {

    @Autowired
    private MarcaRepository marcaRepository;

    @Override
    public List<Marca> obtenerTodas() {
        return marcaRepository.findAll();
    }

    @Override
    public Optional<Marca> obtenerPorId(Long id) {
        return marcaRepository.findById(id);
    }

    @Override
    public Marca crear(Marca marca) {
        return marcaRepository.save(marca);
    }

    @Override
    public Optional<Marca> actualizar(Long id, Marca marcaActualizada) {
        return marcaRepository.findById(id).map(m -> {
            m.setNombre(marcaActualizada.getNombre());
            m.setDescripcion(marcaActualizada.getDescripcion());
            return marcaRepository.save(m);
        });
    }

    @Override
    public boolean eliminar(Long id) {
        if (marcaRepository.existsById(id)) {
            marcaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
