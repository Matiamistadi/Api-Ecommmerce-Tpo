package com.uade.tpo.ecommerce.config;

import com.uade.tpo.ecommerce.entity.Categoria;
import com.uade.tpo.ecommerce.entity.ImagenProducto;
import com.uade.tpo.ecommerce.entity.Marca;
import com.uade.tpo.ecommerce.entity.Producto;
import com.uade.tpo.ecommerce.repository.CategoriaRepository;
import com.uade.tpo.ecommerce.repository.MarcaRepository;
import com.uade.tpo.ecommerce.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Siembra los productos originales del catálogo (NEXA y BULL) al arrancar.
 * Es idempotente: solo crea lo que falta, así no duplica en cada reinicio.
 * Corre después de SeedImageInitializer, que deja las imágenes semilla en uploads/.
 */
@Component
@Order(2)
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;
    private final ProductoRepository productoRepository;

    @Override
    public void run(String... args) {
        // 1) Categorías y marcas (se crean una sola vez)
        Categoria proteina = obtenerOCrearCategoria("Proteína");
        Categoria energia = obtenerOCrearCategoria("Energía");
        Categoria recuperacion = obtenerOCrearCategoria("Recuperación");
        Categoria fuerza = obtenerOCrearCategoria("Fuerza");

        Marca nexa = obtenerOCrearMarca("NEXA");
        Marca bull = obtenerOCrearMarca("BULL");

        // 2) Productos originales del front (todos activos)
        // ── Proteínas ──
        crearProducto("Proteína Vainilla", nexa, proteina, 42.99, 52.99, 20,
                "Proteína de suero de alta calidad, sabor vainilla. 25g de proteína por porción, ideal para recuperación y construcción muscular post-entrenamiento.",
                "ProteVainilla.png", "ProteVainillaDetalle.png");
        crearProducto("Proteína Chocolate", nexa, proteina, 42.99, 52.99, 18,
                "Proteína de suero de alta calidad, sabor chocolate. 25g de proteína por porción, mezcla perfecta y textura cremosa.",
                "ProteCHCL.png", "ProteCHCLDetalle.png");
        crearProducto("Proteína Vainilla", bull, proteina, 38.99, 46.99, 15,
                "Whey protein sabor vainilla de Bull Nutrition. Fórmula premium con aminoácidos esenciales para máxima recuperación muscular.",
                "ProteVainillaBull.png");
        crearProducto("Proteína Chocolate", bull, proteina, 38.99, 46.99, 22,
                "Whey protein sabor chocolate de Bull Nutrition. Alto contenido proteico con un sabor intenso y satisfactorio.",
                "ProteCHCLBull.png");

        // ── Energía / Pre-Workout ──
        crearProducto("Pre-Work Manzana", nexa, energia, 34.99, 41.99, 14,
                "Pre-entrenamiento sabor manzana verde. Cafeína, beta-alanina y citrulina para energía explosiva, foco mental y bombeo muscular máximo.",
                "PreworkManzana.png", "PreworkManzanaDetalle.png");
        crearProducto("Pre-Work Sandía", nexa, energia, 34.99, 41.99, 11,
                "Pre-entrenamiento sabor sandía. Formula avanzada con nooLVL y extracto de remolacha para rendimiento y resistencia sostenida.",
                "PreworkSandia.png", "PreworkSandiaDetalle.png");
        crearProducto("Pre-Work Manzana", bull, energia, 29.99, 35.99, 16,
                "Pre-entrenamiento sabor manzana de Bull. Energía de liberación sostenida con 200mg de cafeína natural y vitaminas del complejo B.",
                "PreworkManzanaBull.png");
        crearProducto("Pre-Work Sandía", bull, energia, 29.99, 35.99, 9,
                "Pre-entrenamiento sabor sandía de Bull. Ideal para entrenamientos de alta intensidad, con arginina y beta-alanina para el bombeo.",
                "PreworkSandiaBull.png");

        // ── Recuperación ──
        crearProducto("BCAA Azul", nexa, recuperacion, 26.99, 33.99, 24,
                "Aminoácidos ramificados BCAA 2:1:1 sabor frutal azul. Reduce el catabolismo muscular y acelera la recuperación post-entrenamiento.",
                "BCAABLUE.png", "BCAABLUEDetalle.png");
        crearProducto("BCAA", bull, recuperacion, 23.99, null, 19,
                "BCAA de Bull Nutrition. Ratio óptimo 2:1:1 de leucina, isoleucina y valina para proteger el músculo y mejorar la resistencia.",
                "BCAABULL.png");
        crearProducto("EAA Ponche", nexa, recuperacion, 31.99, 38.99, 12,
                "Aminoácidos esenciales completos sabor ponche tropical. Los 9 EAA que el cuerpo no puede sintetizar, para síntesis proteica óptima.",
                "EaaPonche.png", "EaaPoncheDetalle.png");
        crearProducto("EAA", bull, recuperacion, 28.99, null, 17,
                "EAA completo de Bull Nutrition. Perfil aminoacídico esencial para recuperación muscular profunda y reducción del dolor post-ejercicio.",
                "EAABULL.png");
        crearProducto("L-Glutamina Sin Sabor", nexa, recuperacion, 22.99, null, 30,
                "L-Glutamina pura sin sabor de Nexa. Soporta la recuperación muscular, la salud intestinal y el sistema inmune en periodos de entrenamiento intenso.",
                "L-glutaminasinsabor.png", "L-glutaminasinsaborDetalleImg.png");
        crearProducto("Glutamina", bull, recuperacion, 19.99, null, 25,
                "Glutamina de Bull Nutrition. Aminoácido clave para la recuperación muscular, ideal para consumir inmediatamente después del entrenamiento.",
                "GlutaminaBull.png");

        // ── Fuerza / Creatina ──
        crearProducto("Creatina Lima", nexa, fuerza, 24.99, 29.99, 28,
                "Creatina monohidratada sabor lima de Nexa. Aumenta la fuerza, la potencia y el volumen muscular. Micronizada para máxima absorción.",
                "CreatinaLima.png", "CreatinaLimaDetalleImg.png");
        crearProducto("Creatina Sin Sabor", nexa, fuerza, 22.99, null, 35,
                "Creatina monohidratada pura sin sabor de Nexa. De pureza farmacéutica, se mezcla perfectamente con cualquier bebida o batido.",
                "CreatinaMonohidratoSINSABROO.png", "CreatinaMonohidratoSINSABROODetalle.png");
        crearProducto("Creatina", bull, fuerza, 21.99, 26.99, 20,
                "Creatina de Bull Nutrition. Fórmula de creatina monohidratada de alta pureza para incrementar la fuerza explosiva y el rendimiento anaeróbico.",
                "CreatinaBull.png");
        crearProducto("Creatina Limón", bull, fuerza, 21.99, 26.99, 13,
                "Creatina sabor limón de Bull Nutrition. Misma potencia que la creatina original con un refrescante sabor a limón para tomarla más fácilmente.",
                "CreatinaBullLimon.png");
    }

    private Categoria obtenerOCrearCategoria(String nombre) {
        return categoriaRepository.findAll().stream()
                .filter(c -> nombre.equalsIgnoreCase(c.getNombre()))
                .findFirst()
                .orElseGet(() -> {
                    Categoria c = new Categoria();
                    c.setNombre(nombre);
                    return categoriaRepository.save(c);
                });
    }

    private Marca obtenerOCrearMarca(String nombre) {
        return marcaRepository.findAll().stream()
                .filter(m -> nombre.equalsIgnoreCase(m.getNombre()))
                .findFirst()
                .orElseGet(() -> {
                    Marca m = new Marca();
                    m.setNombre(nombre);
                    return marcaRepository.save(m);
                });
    }

    private void crearProducto(String nombre, Marca marca, Categoria categoria,
                               double precio, Double precioOriginal, int stock,
                               String descripcion, String... nombresArchivo) {
        // ¿Ya existe un producto con ese nombre y esa marca?
        Optional<Producto> existente = productoRepository.findAll().stream()
                .filter(p -> nombre.equalsIgnoreCase(p.getNombre())
                        && p.getMarca() != null
                        && marca.getNombre().equalsIgnoreCase(p.getMarca().getNombre()))
                .findFirst();

        if (existente.isPresent()) {
            Producto p = existente.get();
            boolean cambios = false;
            // Migración: si el precio está en escala vieja (dólares, < 1000), lo pasamos a pesos (x1000)
            if (p.getPrecio() != null && p.getPrecio() < 1000) {
                p.setPrecio(p.getPrecio() * 1000);
                if (p.getPrecioOriginal() != null) {
                    p.setPrecioOriginal(p.getPrecioOriginal() * 1000);
                } else if (precioOriginal != null) {
                    p.setPrecioOriginal(precioOriginal * 1000);
                }
                cambios = true;
            } else if (p.getPrecioOriginal() == null && precioOriginal != null) {
                // Solo completamos el precio original si faltaba (ya estaba en pesos)
                p.setPrecioOriginal(precioOriginal * 1000);
                cambios = true;
            }
            // Migración: productos creados antes de sumar imágenes al seeder no tienen ImagenProducto
            if ((p.getImagenes() == null || p.getImagenes().isEmpty()) && nombresArchivo.length > 0) {
                List<ImagenProducto> imagenes = new ArrayList<>();
                for (String nombreArchivo : nombresArchivo) {
                    ImagenProducto img = new ImagenProducto();
                                        img.setUrl("/uploads/" + nombreArchivo);
                    img.setProducto(p);
                    imagenes.add(img);
                }
                p.setImagenes(imagenes);
                cambios = true;
            }
            if (cambios) productoRepository.save(p);
            return;
        }

        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        // Los números del seeder están en escala dólar; los pasamos a pesos (x1000)
        producto.setPrecio(precio * 1000);
        producto.setPrecioOriginal(precioOriginal != null ? precioOriginal * 1000 : null);
        producto.setStock(stock);
        producto.setActivo(true);
        producto.setCategoria(categoria);
        producto.setMarca(marca);

        List<ImagenProducto> imagenes = new ArrayList<>();
        for (String nombreArchivo : nombresArchivo) {
            ImagenProducto img = new ImagenProducto();
                        img.setUrl("/uploads/" + nombreArchivo);
            img.setProducto(producto);
            imagenes.add(img);
        }
        producto.setImagenes(imagenes);

        productoRepository.save(producto);
    }
}
