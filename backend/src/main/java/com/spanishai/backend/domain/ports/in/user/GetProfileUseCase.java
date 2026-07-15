package com.spanishai.backend.domain.ports.in.user;

import com.spanishai.backend.domain.model.Profile;

import java.util.Map;
import java.util.UUID;

public interface GetProfileUseCase {

    Profile getCurrentProfile(GetProfileCommand command);

    record GetProfileCommand(UUID profileId, String email, Map<String, Object> userMetadata) {
    }
}
