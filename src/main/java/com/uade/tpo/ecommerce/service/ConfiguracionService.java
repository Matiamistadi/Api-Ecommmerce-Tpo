package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Configuracion;
import com.uade.tpo.ecommerce.repository.ConfiguracionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConfiguracionService {

    private final ConfiguracionRepository configuracionRepository;

    // Devuelve la configuración (si todavía no existe, crea una con valores por defecto)
    public Configuracion obtener() {
        return configuracionRepository.findAll().stream().findFirst().orElseGet(() ->
                configuracionRepository.save(Configuracion.builder()
                        .emailContacto("contacto@gymstore.com")
                        .telefono("+54 11 5555-0000")
                        .costoEnvio(3500.0)
                        .montoEnvioGratis(50000.0)
                        .notifStockBajo(true)
                        .notifNuevosPedidos(true)
                        .notifClientesNuevos(false)
                        .build()));
    }

    // Actualiza la configuración (solo pisa los campos que llegan)
    public Configuracion actualizar(Configuracion datos) {
        Configuracion config = obtener();

        if (datos.getEmailContacto() != null) config.setEmailContacto(datos.getEmailContacto());
        if (datos.getTelefono() != null) config.setTelefono(datos.getTelefono());
        if (datos.getCostoEnvio() != null) config.setCostoEnvio(datos.getCostoEnvio());
        if (datos.getMontoEnvioGratis() != null) config.setMontoEnvioGratis(datos.getMontoEnvioGratis());

        config.setNotifStockBajo(datos.isNotifStockBajo());
        config.setNotifNuevosPedidos(datos.isNotifNuevosPedidos());
        config.setNotifClientesNuevos(datos.isNotifClientesNuevos());

        return configuracionRepository.save(config);
    }
}
