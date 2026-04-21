package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.config.JwtService;
import com.uade.tpo.ecommerce.dto.AuthenticationRequest;
import com.uade.tpo.ecommerce.dto.AuthenticationResponse;
import com.uade.tpo.ecommerce.dto.RegisterRequest;
import com.uade.tpo.ecommerce.entity.Rol;
import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Registra un nuevo usuario, encripta su contraseña y devuelve un JWT.
     */
    public AuthenticationResponse register(RegisterRequest request) {
        var usuario = Usuario.builder()
                .email(request.getEmail())
                // Nunca guardamos contraseñas en texto plano
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.CLIENTE)
                .fechaRegistro(LocalDateTime.now())
                .activo(true)
                .build();

        usuarioRepository.save(usuario);

        // Generar token para el usuario recién creado
        var jwtToken = jwtService.generateToken(usuario);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    /**
     * Autentica un usuario existente validando email y contraseña.
     * Si los datos son incorrectos, Spring lanza una excepción automáticamente.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Spring valida email + contraseña. Si falla, lanza BadCredentialsException.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Si llegamos acá, las credenciales son correctas
        var usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(usuario);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }
}
