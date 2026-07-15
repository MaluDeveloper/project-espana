package com.spanishai.backend.domain.ports.in.user;

import com.spanishai.backend.domain.model.UserPreferences;

import java.time.LocalTime;
import java.util.Map;
import java.util.UUID;

public interface UpdatePreferencesUseCase {

    UserPreferences updateCurrentPreferences(UpdatePreferencesCommand command);

    /**
     * Carrega email/userMetadata pelo mesmo motivo de UpdateProfileCommand: um PUT
     * de preferencias pode chegar antes de qualquer GET, exigindo provisionar o
     * profile (FK de user_preferences.profile_id) antes de provisionar as
     * preferencias em si.
     */
    record UpdatePreferencesCommand(UUID profileId, String email, Map<String, Object> userMetadata,
                                     String fontSize, boolean soundEnabled, boolean showTranslation,
                                     LocalTime reminderTime, boolean notificationsEnabled) {
    }
}
