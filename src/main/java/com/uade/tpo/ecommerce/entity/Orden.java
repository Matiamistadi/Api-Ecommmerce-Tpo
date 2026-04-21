package com.uade.tpo.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ordenes")
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"passwordHash", "password", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled", "username"})
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @JsonIgnoreProperties({"usuario"})
    @ManyToOne
    @JoinColumn(name = "id_direccion_envio")
    private Direccion direccionEnvio;

    @Enumerated(EnumType.STRING)
    private EstadoOrden estado;

    @Column(name = "descuento_total")
    private Double descuentoTotal;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @JsonManagedReference("orden-items")
    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ItemOrden> items;

    @OneToOne(mappedBy = "orden")
    private Pago pago;
}