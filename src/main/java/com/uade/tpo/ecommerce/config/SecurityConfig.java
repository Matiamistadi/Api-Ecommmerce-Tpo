package com.uade.tpo.ecommerce.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth

                // ── Rutas públicas (sin token) ──────────────────────────────
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/status").permitAll()

                // Cualquiera puede ver el catálogo (vidriera del gym)
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/marcas/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/descuentos/**").permitAll()

                // ── Solo ADMIN puede crear/modificar el catálogo ────────────
                .requestMatchers(HttpMethod.POST, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/api/marcas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/marcas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/marcas/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/api/descuentos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/descuentos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/descuentos/**").hasRole("ADMIN")

                // Solo ADMIN puede ver todas las órdenes y cambiar su estado
                .requestMatchers(HttpMethod.GET, "/api/ordenes").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/ordenes/**").hasRole("ADMIN")

                // Solo ADMIN puede ver todos los usuarios y cambiar roles
                .requestMatchers(HttpMethod.GET, "/api/usuarios").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/rol").hasRole("ADMIN")

                // ── CLIENTE y ADMIN pueden operar el carrito, órdenes, pagos y direcciones ──
                .requestMatchers("/api/carritos/**").hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/ordenes/usuario/**").hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/pagos/**").hasAnyRole("CLIENTE", "ADMIN")
                .requestMatchers("/api/usuarios/*/direcciones/**").hasAnyRole("CLIENTE", "ADMIN")

                // El resto requiere estar autenticado
                .anyRequest().authenticated()
            )
            // Sin sesión en servidor (stateless — JWT se manda en cada request)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(ex -> ex
                // 401 — no hay token o el token es inválido/expirado
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\":\"No autenticado: token ausente o inválido\"}");
                })
                // 403 — hay token válido pero el rol no tiene permisos
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(403);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\":\"Acceso denegado: permisos insuficientes\"}");
                })
            )
            .authenticationProvider(authenticationProvider)
            // Registrar nuestro filtro JWT ANTES del filtro de usuario/contraseña de Spring
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
