package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.config.JwtService;
import com.uade.tpo.ecommerce.dto.AuthenticationRequest;
import com.uade.tpo.ecommerce.dto.AuthenticationResponse;
import com.uade.tpo.ecommerce.dto.RegisterRequest;
import com.uade.tpo.ecommerce.entity.Rol;
import com.uade.tpo.ecommerce.entity.TokenRecuperacion;
import com.uade.tpo.ecommerce.entity.Usuario;
import com.uade.tpo.ecommerce.repository.TokenRecuperacionRepository;
import com.uade.tpo.ecommerce.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRecuperacionRepository tokenRepo;
    private final EmailService emailService;

    /**
     * Registra un nuevo usuario, encripta su contraseña y devuelve un JWT.
     */
    public AuthenticationResponse register(RegisterRequest request) {
        var usuario = Usuario.builder()
                .email(request.getEmail())
                .nombre(request.getNombre())
                // Nunca guardamos contraseñas en texto plano
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.CLIENTE)
                .fechaRegistro(LocalDateTime.now())
                .activo(true)
                .build();

        usuarioRepository.save(usuario);
        emailService.enviarBienvenida(usuario.getEmail(), usuario.getNombre());

        // Generar token para el usuario recién creado
        var jwtToken = jwtService.generateToken(usuario);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .rol(usuario.getRol().name())
                .id(usuario.getId())
                .email(usuario.getEmail())
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
                .rol(usuario.getRol().name())
                .id(usuario.getId())
                .email(usuario.getEmail())
                .build();
    }

    public void iniciarRecuperacion(String email) {
        // Siempre respondemos 204 aunque el email no exista (evita user enumeration)
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            String token = UUID.randomUUID().toString();
            tokenRepo.save(new TokenRecuperacion(token, email));
            emailService.enviarRecuperacionPassword(email, token);
        });
    }

    public void resetearPassword(String token, String nuevaPassword) {
        TokenRecuperacion tr = tokenRepo.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido o expirado"));
        if (!tr.estaVigente()) {
            throw new IllegalArgumentException("El token expiró o ya fue usado");
        }
        Usuario usuario = usuarioRepository.findByEmail(tr.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
        tr.setUsado(true);
        tokenRepo.save(tr);
    }
}
