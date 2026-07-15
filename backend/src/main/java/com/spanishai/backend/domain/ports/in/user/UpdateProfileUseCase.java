package com.spanishai.backend.domain.ports.in.user;

import com.spanishai.backend.domain.model.Profile;

import java.util.Map;
import java.util.UUID;

public interface UpdateProfileUseCase {

    Profile updateCurrentProfile(UpdateProfileCommand command);

    /**
     * Carrega email/userMetadata (nao so os campos editaveis) porque um PUT pode
     * ser a primeira requisicao autenticada do usuario -- nesse caso o profile
     * ainda nao existe e precisa ser provisionado antes do update.
     */
    record UpdateProfileCommand(UUID profileId, String email, Map<String, Object> userMetadata,
                                 String name, String avatarUrl, String locale, String timezone) {
    }
}
