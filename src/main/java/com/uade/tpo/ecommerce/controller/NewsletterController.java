package com.uade.tpo.ecommerce.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final JavaMailSender mailSender;

    @PostMapping("/suscribir")
    public ResponseEntity<Map<String, String>> suscribir(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email requerido"));
        }

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(email);
        mensaje.setSubject("¡Bienvenido a GymStore Elite!");
        mensaje.setText("""
                ¡Hola!

                Gracias por suscribirte a GymStore. A partir de ahora vas a recibir:

                  • Tips de entrenamiento
                  • Ofertas exclusivas
                  • Acceso anticipado a nuevos lanzamientos

                ¡Que arranque el entrenamiento!

                — El equipo de GymStore
                """);

        mailSender.send(mensaje);
        return ResponseEntity.ok(Map.of("mensaje", "¡Suscripción exitosa! Revisá tu bandeja de entrada."));
    }
}
