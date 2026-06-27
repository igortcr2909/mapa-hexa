package com.coopa.application.auth.dto;

public record AuthResponseDTO(
    String token,
    String userId,
    String nome,
    String email,
    String tokenType,
    Long expiresIn
) {}
