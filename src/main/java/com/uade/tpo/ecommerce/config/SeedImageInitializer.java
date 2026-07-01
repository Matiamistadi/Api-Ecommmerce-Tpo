package com.uade.tpo.ecommerce.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

/**
 * Copia las imágenes semilla del catálogo (empaquetadas en resources/seed-images/)
 * hacia la carpeta física uploads/, para que DataSeeder pueda enlazarlas con las
 * mismas URLs que usan las imágenes subidas por los admins. Corre antes que
 * DataSeeder y es idempotente: no pisa un archivo que ya exista en uploads/.
 */
@Slf4j
@Component
@Order(1)
public class SeedImageInitializer implements CommandLineRunner {

    private static final List<String> ARCHIVOS = List.of(
            "ProteVainilla.png", "ProteCHCL.png", "ProteVainillaBull.png", "ProteCHCLBull.png",
            "PreworkManzana.png", "PreworkSandia.png", "PreworkManzanaBull.png", "PreworkSandiaBull.png",
            "BCAABLUE.png", "BCAABULL.png", "EaaPonche.png", "EAABULL.png",
            "L-glutaminasinsabor.png", "GlutaminaBull.png", "CreatinaLima.png",
            "CreatinaMonohidratoSINSABROO.png", "CreatinaBull.png", "CreatinaBullLimon.png",
            "ProteVainillaDetalle.png", "ProteCHCLDetalle.png", "PreworkManzanaDetalle.png",
            "PreworkSandiaDetalle.png", "BCAABLUEDetalle.png", "EaaPoncheDetalle.png",
            "L-glutaminasinsaborDetalleImg.png", "CreatinaLimaDetalleImg.png",
            "CreatinaMonohidratoSINSABROODetalle.png"
    );

    @Override
    public void run(String... args) throws IOException {
        Path carpetaUploads = Paths.get("uploads");
        Files.createDirectories(carpetaUploads);

        for (String nombreArchivo : ARCHIVOS) {
            Path destino = carpetaUploads.resolve(nombreArchivo);
            if (Files.exists(destino)) {
                continue;
            }
            ClassPathResource recurso = new ClassPathResource("seed-images/" + nombreArchivo);
            if (!recurso.exists()) {
                log.warn("No se encontró la imagen semilla {} en el classpath", nombreArchivo);
                continue;
            }
            try (InputStream in = recurso.getInputStream()) {
                Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
            }
        }
    }
}
