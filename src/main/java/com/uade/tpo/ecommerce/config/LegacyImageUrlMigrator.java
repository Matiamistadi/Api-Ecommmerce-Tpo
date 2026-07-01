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
    private static final String PREFIJO_UPLOADS = "/uploads/";

    @Override
    public void run(String... args) {
        List<ImagenProducto> imagenesLegacy = imagenProductoRepository.findAll().stream()
                .filter(img -> img.getUrl() != null && esUrlLegacy(img.getUrl()))
                .toList();

        if (imagenesLegacy.isEmpty()) {
            return;
        }

        for (ImagenProducto img : imagenesLegacy) {
            String nombreArchivo = extraerNombreArchivo(img.getUrl());
            img.setUrl(appBaseUrl + "/uploads/" + nombreArchivo);
        }
        imagenProductoRepository.saveAll(imagenesLegacy);
        log.info("Migradas {} URLs de imágenes del esquema viejo (/img/...) al nuevo (/uploads/...)",
                imagenesLegacy.size());
    }

    private boolean esUrlLegacy(String url) {
        if (url.startsWith(PREFIJO_VIEJO)) {
            return true;
        }

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            return false;
        }

        try {
            java.net.URI uri = java.net.URI.create(url);
            String host = uri.getHost();
            if (!"localhost".equals(host) && !"127.0.0.1".equals(host)) {
                return false;
            }

            String path = uri.getPath();
            return path != null && (path.startsWith(PREFIJO_VIEJO) || path.startsWith(PREFIJO_UPLOADS));
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private String extraerNombreArchivo(String url) {
        if (url.startsWith(PREFIJO_VIEJO) || url.startsWith(PREFIJO_UPLOADS)) {
            String nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
            return nombreArchivo;
        }

        java.net.URI uri = java.net.URI.create(url);
        String path = uri.getPath() != null ? uri.getPath() : "";
        String nombreArchivo = path.substring(path.lastIndexOf('/') + 1);
        return nombreArchivo;
    }
}
