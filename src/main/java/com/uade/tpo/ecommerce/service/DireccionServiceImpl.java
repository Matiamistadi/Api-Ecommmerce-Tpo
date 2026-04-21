package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Direccion;
import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.repository.DireccionRepository;
import com.uade.tpo.ecommerce.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DireccionServiceImpl implements DireccionService {

    private final DireccionRepository direccionRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public List<Direccion> obtenerPorUsuario(Long usuarioId) {
        return direccionRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public Optional<Direccion> obtenerPorId(Long id) {
        return direccionRepository.findById(id);
    }

    @Override
    public Direccion crear(Long usuarioId, Direccion direccion) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario con id " + usuarioId + " no encontrado"));
        direccion.setUsuario(usuario);
        return direccionRepository.save(direccion);
    }

    @Override
    public Optional<Direccion> actualizar(Long id, Direccion direccionActualizada) {
        return direccionRepository.findById(id).map(existente -> {
            existente.setCalle(direccionActualizada.getCalle());
            existente.setCiudad(direccionActualizada.getCiudad());
            existente.setProvincia(direccionActualizada.getProvincia());
            existente.setCodigoPostal(direccionActualizada.getCodigoPostal());
            existente.setEsPrincipal(direccionActualizada.isEsPrincipal());
            return direccionRepository.save(existente);
        });
    }

    @Override
    public boolean eliminar(Long id) {
        if (direccionRepository.existsById(id)) {
            direccionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
