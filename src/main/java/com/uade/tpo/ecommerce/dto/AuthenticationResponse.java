package com.uade.tpo.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {

    @JsonProperty("access_token")
    private String accessToken;

    // Devolvemos también el rol para que el front sepa si es CLIENTE o ADMIN
    @JsonProperty("rol")
    private String rol;

    // id y email del usuario: el front los usa para armar las URLs del carrito/órdenes
    @JsonProperty("id")
    private Long id;

    @JsonProperty("email")
    private String email;
}
