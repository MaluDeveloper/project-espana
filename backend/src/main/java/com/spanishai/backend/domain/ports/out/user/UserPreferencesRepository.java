package com.spanishai.backend.domain.ports.out.user;

import com.spanishai.backend.domain.model.UserPreferences;

import java.util.Optional;
import java.util.UUID;

public interface UserPreferencesRepository {

    Optional<UserPreferences> findById(UUID id);

    UserPreferences save(UserPreferences preferences);

    /**
     * Mesma garantia de ProfileRepository#create: corrida concorrente na primeira
     * insercao e resolvida pela implementacao, nao por quem chama a porta.
     */
    UserPreferences create(UserPreferences preferences);
}
