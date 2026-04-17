package com.uade.tpo.ecommerce.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

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
            final String userEmail = jwtService.extractUsername(jwt);
            log.info("JWT Filter — email extraído del token: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                log.info("JWT Filter — usuario cargado: {}, authorities: {}", userDetails.getUsername(), userDetails.getAuthorities());

                boolean valid = jwtService.isTokenValid(jwt, userDetails);
                log.info("JWT Filter — token válido: {}", valid);

                if (valid) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContext context = SecurityContextHolder.createEmptyContext();
                    context.setAuthentication(authToken);
                    SecurityContextHolder.setContext(context);
                    log.info("JWT Filter — SecurityContext poblado para: {} con roles: {}", userEmail, userDetails.getAuthorities());
                } else {
                    log.warn("JWT Filter — token inválido o expirado para: {}", userEmail);
                    SecurityContextHolder.clearContext();
                    writeUnauthorized(response, "Token inválido o expirado");
                    return;
                }
            }
        } catch (Exception e) {
            log.warn("JWT Filter — excepción procesando token [{}]: {}", e.getClass().getSimpleName(), e.getMessage());
            SecurityContextHolder.clearContext();
            writeUnauthorized(response, "Token inválido o expirado");
            return;
        }

        // Continuar con el siguiente filtro
        filterChain.doFilter(request, response);
    }

    // Escribe 401 directamente sin response.sendError() para evitar el forward
    // automático a /error, que Spring Security re-evalúa y sobrescribe el status.
    private void writeUnauthorized(HttpServletResponse response, String mensaje) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"error\":\"" + mensaje + "\"}");
    }
}
