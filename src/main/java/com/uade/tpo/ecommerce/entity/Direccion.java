package com.uade.tpo.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "direcciones")
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    private String calle;
    private String ciudad;
    private String provincia;

    @Column(name = "codigo_postal")
    private String codigoPostal;

    @Column(name = "es_principal")
    private boolean esPrincipal;

    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "direccionEnvio")
    private List<Orden> ordenes;
}
