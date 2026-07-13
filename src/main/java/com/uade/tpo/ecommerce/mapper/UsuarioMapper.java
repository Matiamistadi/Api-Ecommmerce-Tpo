package com.uade.tpo.ecommerce.mapper;

import com.uade.tpo.ecommerce.dto.UsuarioResponseDTO;
import com.uade.tpo.ecommerce.entity.Usuario;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .telefono(usuario.getTelefono())
                .rol(usuario.getRol())
                .fechaRegistro(usuario.getFechaRegistro())
                .activo(usuario.isActivo())
                .build();
    }

    public List<UsuarioResponseDTO> toResponseDTO(List<Usuario> usuarios) {
        return usuarios.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}
