package com.uade.tpo.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @JsonIgnore para no causar ciclo con Orden.pago
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "id_orden", nullable = false)
    private Orden orden;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago")
    private MetodoPago metodoPago;

    private Double monto;

    @Enumerated(EnumType.STRING)
    private EstadoPago estado;

    @Column(name = "referencia_id")
    private String referenciaId;
}
