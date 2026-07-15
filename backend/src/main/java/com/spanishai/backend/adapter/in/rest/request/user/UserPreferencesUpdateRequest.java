package com.spanishai.backend.adapter.in.rest.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalTime;

@Schema(description = "Dados editaveis das preferencias do usuario autenticado")
public record UserPreferencesUpdateRequest(

        @NotBlank
        @Pattern(regexp = "normal|large", message = "fontSize deve ser 'normal' ou 'large'")
        @Schema(example = "normal")
        String fontSize,

        boolean soundEnabled,

        boolean showTranslation,

        @Schema(type = "string", pattern = "HH:mm:ss", example = "14:30:00", nullable = true,
                description = "Horario preferido para o lembrete diario; omitir/enviar nulo desativa o lembrete")
        LocalTime reminderTime,

        boolean notificationsEnabled
) {
}
