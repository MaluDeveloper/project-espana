package com.spanishai.backend.adapter.in.rest.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

@Schema(description = "Dados editaveis do perfil do usuario autenticado")
public record ProfileUpdateRequest(

        @NotBlank
        @Size(max = 120)
        String name,

        @URL
        @Size(max = 2048)
        @Schema(nullable = true, description = "URL do avatar; omitir/enviar nulo remove o avatar atual")
        String avatarUrl,

        @NotBlank
        @Pattern(regexp = "pt|en", message = "locale deve ser 'pt' ou 'en'")
        @Schema(example = "pt")
        String locale,

        @NotBlank
        @Schema(description = "Fuso horario IANA valido", example = "America/Sao_Paulo")
        String timezone
) {
}
