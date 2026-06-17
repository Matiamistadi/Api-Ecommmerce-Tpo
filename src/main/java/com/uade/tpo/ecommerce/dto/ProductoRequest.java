package com.uade.tpo.ecommerce.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private Double precio;

    @PositiveOrZero(message = "El precio original no puede ser negativo")
    private Double precioOriginal;

    @NotNull(message = "El stock es obligatorio")
    @PositiveOrZero(message = "El stock no puede ser negativo")
    private Integer stock;

    private Long categoriaId;
    private Long marcaId;
}
