package com.spanishai.backend.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalTime;

@Schema(description = "Preferencias do usuario autenticado")
public record UserPreferencesResponse(

        @Schema(example = "normal", description = "'normal' ou 'large'")
        String fontSize,

        boolean soundEnabled,

        boolean showTranslation,

        @Schema(type = "string", pattern = "HH:mm:ss", example = "14:30:00", nullable = true,
                description = "Horario preferido para o lembrete diario; nulo desativa o lembrete")
        LocalTime reminderTime,

        boolean notificationsEnabled
) {
}
