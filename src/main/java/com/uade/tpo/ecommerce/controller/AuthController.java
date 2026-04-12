package com.uade.tpo.ecommerce.controller;

import com.uade.tpo.ecommerce.dto.AuthenticationRequest;
import com.uade.tpo.ecommerce.dto.AuthenticationResponse;
import com.uade.tpo.ecommerce.dto.RegisterRequest;
import com.uade.tpo.ecommerce.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
