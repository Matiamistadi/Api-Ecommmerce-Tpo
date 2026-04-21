package com.uade.tpo.ecommerce.dto;

import com.uade.tpo.ecommerce.entity.Rol;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CambiarRolRequest {

    @NotNull(message = "El rol es obligatorio")
    private Rol rol;
}
