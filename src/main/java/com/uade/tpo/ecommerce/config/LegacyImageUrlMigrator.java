package com.uade.tpo.ecommerce.config;

import com.uade.tpo.ecommerce.entity.ImagenProducto;
import com.uade.tpo.ecommerce.repository.ImagenProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Migra las URLs de imágenes con el esquema viejo ("/img/..." servido antes
 * desde Client/public/img) al esquema actual (URL absoluta a /uploads/ en el
 * backend, ver SeedImageInitializer y DataSeeder). Afecta a bases de datos
 * creadas antes del cambio 8f04ea0. Corre antes que SeedImageInitializer
 * y es idempotente: no hace nada si no quedan URLs con el prefijo viejo.
 */
@Slf4j
@Component
@Order(0)
@RequiredArgsConstructor
public class LegacyImageUrlMigrator implements CommandLineRunner {

    private final ImagenProductoRepository imagenProductoRepository;

    @Value("${app.base-url}")
    private String appBaseUrl;

    private static final String PREFIJO_VIEJO = "/img/";

    @Override
    public void run(String... args) {
        List<ImagenProducto> imagenesLegacy = imagenProductoRepository.findAll().stream()
                .filter(img -> img.getUrl() != null && img.getUrl().startsWith(PREFIJO_VIEJO))
                .toList();

        if (imagenesLegacy.isEmpty()) {
            return;
        }

        for (ImagenProducto img : imagenesLegacy) {
            String nombreArchivo = img.getUrl().substring(PREFIJO_VIEJO.length());
            int ultimaBarra = nombreArchivo.lastIndexOf('/');
            if (ultimaBarra >= 0) {
                nombreArchivo = nombreArchivo.substring(ultimaBarra + 1);
            }
            img.setUrl(appBaseUrl + "/uploads/" + nombreArchivo);
        }
        imagenProductoRepository.saveAll(imagenesLegacy);
        log.info("Migradas {} URLs de imágenes del esquema viejo (/img/...) al nuevo (/uploads/...)",
                imagenesLegacy.size());
    }
}
