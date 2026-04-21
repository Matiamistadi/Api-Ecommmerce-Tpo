package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Categoria;
import com.uade.tpo.ecommerce.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }

    @Override
    public Optional<Categoria> obtenerPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    @Override
    public Categoria crear(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public Optional<Categoria> actualizar(Long id, Categoria categoriaActualizada) {
        return categoriaRepository.findById(id).map(c -> {
            c.setNombre(categoriaActualizada.getNombre());
            c.setDescripcion(categoriaActualizada.getDescripcion());
            return categoriaRepository.save(c);
        });
    }

    @Override
    public boolean eliminar(Long id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
