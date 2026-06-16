package com.uade.tpo.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Configuración general de la tienda. Es una tabla de UN solo registro:
 * guarda el contacto, los datos de envío y las preferencias de notificaciones.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "configuracion")
public class Configuracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Contacto de la tienda (se muestra en la página de Contacto)
    private String emailContacto;
    private String telefono;

    // Envíos
    private Double costoEnvio;
    private Double montoEnvioGratis;

    // Preferencias de notificaciones
    private boolean notifStockBajo;
    private boolean notifNuevosPedidos;
    private boolean notifClientesNuevos;
}
