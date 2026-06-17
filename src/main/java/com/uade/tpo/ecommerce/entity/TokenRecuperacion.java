package com.uade.tpo.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tokens_recuperacion")
public class TokenRecuperacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDateTime expiracion;

    private boolean usado = false;

    public TokenRecuperacion(String token, String email) {
        this.token = token;
        this.email = email;
        this.expiracion = LocalDateTime.now().plusHours(1);
    }

    public boolean estaVigente() {
        return !usado && LocalDateTime.now().isBefore(expiracion);
    }
}
