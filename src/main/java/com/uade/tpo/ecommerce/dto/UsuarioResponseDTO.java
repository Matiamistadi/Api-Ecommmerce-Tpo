package com.uade.tpo.ecommerce.dto;

import com.uade.tpo.ecommerce.entity.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {

    private Long id;
    private String email;
    private String nombre;
    private String telefono;
    private Rol rol;
    private LocalDateTime fechaRegistro;
    private boolean activo;
}
