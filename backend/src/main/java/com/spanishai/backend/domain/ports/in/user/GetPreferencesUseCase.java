package com.spanishai.backend.domain.ports.in.user;

import com.spanishai.backend.domain.model.UserPreferences;

import java.util.Map;
import java.util.UUID;

public interface GetPreferencesUseCase {

    UserPreferences getCurrentPreferences(GetPreferencesCommand command);

    record GetPreferencesCommand(UUID profileId, String email, Map<String, Object> userMetadata) {
    }
}
