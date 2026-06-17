package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.dto.*;
import com.uade.tpo.ecommerce.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    /**
     * POST /api/v1/auth/register
     * Body: { "email": "...", "password": "...", "rol": "CLIENTE" }
     * Response: { "access_token": "eyJ..." }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    /**
     * POST /api/v1/auth/authenticate
     * Body: { "email": "...", "password": "..." }
     * Response: { "access_token": "eyJ..." }
     */
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authenticationService.iniciarRecuperacion(request.getEmail());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authenticationService.resetearPassword(request.getToken(), request.getNuevaPassword());
        return ResponseEntity.noContent().build();
    }
}
