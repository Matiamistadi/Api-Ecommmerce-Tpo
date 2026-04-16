package com.uade.tpo.ecommerce.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Leer el header Authorization
        final String authHeader = request.getHeader("Authorization");

        // Si no hay token o no empieza con "Bearer ", dejamos pasar sin autenticar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extraer el token (lo que viene después de "Bearer ")
        final String jwt = authHeader.substring(7);

        try {
            // 3. Extraer el email del token
            final String userEmail = jwtService.extractUsername(jwt);

            // 4. Si hay email y el usuario aún no está autenticado en el contexto
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 5. Buscar el usuario en la base de datos
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // 6. Validar que el token sea válido para ese usuario
                if (jwtService.isTokenValid(jwt, userDetails)) {

                    // 7. Crear el token de autenticación y guardarlo en el SecurityContext
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token malformado, expirado o firma inválida — se deja el contexto vacío
            // Spring Security lo tratará como no autenticado → 401
            SecurityContextHolder.clearContext();
        }

        // 8. Continuar con el siguiente filtro
        filterChain.doFilter(request, response);
    }
}
