package com.uade.tpo.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "cupones")
public class Cupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código es obligatorio")
    @Column(unique = true, nullable = false)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El tipo es obligatorio")
    private TipoCupon tipo; // PORCENTAJE | MONTO_FIJO

    @NotNull(message = "El valor es obligatorio")
    @Positive(message = "El valor debe ser mayor a 0")
    private Double valor;

    @PositiveOrZero
    private Integer usosMaximos = 0; // 0 = ilimitado

    private Integer usosActuales = 0;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private boolean activo = true;

    public boolean esValido() {
        if (!activo) return false;
        if (usosMaximos > 0 && usosActuales >= usosMaximos) return false;
        LocalDate hoy = LocalDate.now();
        if (fechaInicio != null && hoy.isBefore(fechaInicio)) return false;
        if (fechaFin != null && hoy.isAfter(fechaFin)) return false;
        return true;
    }

    public double calcularDescuento(double subtotal) {
        if (tipo == TipoCupon.PORCENTAJE) {
            return subtotal * (valor / 100.0);
        }
        return Math.min(valor, subtotal);
    }
}
