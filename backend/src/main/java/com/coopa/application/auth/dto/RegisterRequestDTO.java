package com.coopa.application.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(
    @NotBlank(message = "Nome é obrigatório") String nome,
    @Email(message = "E-mail inválido") @NotBlank(message = "E-mail é obrigatório") String email,
    @NotBlank(message = "Senha é obrigatória") @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres") String password
) {}
