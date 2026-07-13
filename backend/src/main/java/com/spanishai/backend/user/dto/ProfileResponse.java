package com.spanishai.backend.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "Perfil do usuario autenticado")
public record ProfileResponse(

        @Schema(description = "Mesmo UUID de auth.users.id (claim `sub` do JWT do Supabase)")
        UUID id,

        String name,

        @Schema(nullable = true)
        String avatarUrl,

        @Schema(description = "Idioma preferido da interface", example = "pt")
        String locale,

        @Schema(description = "Fuso horario IANA, usado para bucketing de sessoes de estudo", example = "America/Sao_Paulo")
        String timezone,

        Instant createdAt
) {
}
