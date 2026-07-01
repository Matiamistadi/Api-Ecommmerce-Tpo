package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contacto")
@RequiredArgsConstructor
public class ContactoController {

    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<Map<String, String>> enviarMensaje(@RequestBody Map<String, String> body) {
        String nombre = body.get("nombre");
        String email = body.get("email");
        String mensaje = body.get("mensaje");

        if (nombre == null || nombre.isBlank() || email == null || email.isBlank() || mensaje == null || mensaje.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Todos los campos son requeridos"));
        }

        emailService.enviarMensajeContacto(nombre, email, mensaje);
        return ResponseEntity.ok(Map.of("mensaje", "¡Mensaje recibido! Te responderemos a la brevedad."));
    }
}
