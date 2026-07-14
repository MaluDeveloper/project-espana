package com.spanishai.backend.user.service;

import com.spanishai.backend.security.CurrentUserProvider;
import com.spanishai.backend.user.dto.UserPreferencesResponse;
import com.spanishai.backend.user.dto.UserPreferencesUpdateRequest;
import com.spanishai.backend.user.entity.UserPreferences;
import com.spanishai.backend.user.mapper.UserPreferencesMapper;
import com.spanishai.backend.user.repository.UserPreferencesRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Provisionamento lazy igual ao de ProfileService: a primeira leitura/escrita de
 * preferencias de um usuario sem linha em `user_preferences` cria a linha com os
 * mesmos defaults do frontend (ver frontend/src/lib/preferences.ts).
 */
@Service
public class UserPreferencesService {

    private static final String DEFAULT_FONT_SIZE = "normal";
    private static final boolean DEFAULT_SOUND_ENABLED = true;
    private static final boolean DEFAULT_SHOW_TRANSLATION = true;
    private static final boolean DEFAULT_NOTIFICATIONS_ENABLED = true;

    private final UserPreferencesRepository userPreferencesRepository;
    private final UserPreferencesMapper userPreferencesMapper;
    private final CurrentUserProvider currentUserProvider;
    private final ProfileService profileService;

    public UserPreferencesService(UserPreferencesRepository userPreferencesRepository,
                                   UserPreferencesMapper userPreferencesMapper,
                                   CurrentUserProvider currentUserProvider,
                                   ProfileService profileService) {
        this.userPreferencesRepository = userPreferencesRepository;
        this.userPreferencesMapper = userPreferencesMapper;
        this.currentUserProvider = currentUserProvider;
        this.profileService = profileService;
    }

    @Transactional
    public UserPreferencesResponse getCurrentPreferences() {
        return userPreferencesMapper.toResponse(getOrCreateCurrentPreferencesEntity());
    }

    @Transactional
    public UserPreferencesResponse updateCurrentPreferences(UserPreferencesUpdateRequest request) {
        UserPreferences preferences = getOrCreateCurrentPreferencesEntity();
        userPreferencesMapper.updateEntityFromRequest(request, preferences);
        return userPreferencesMapper.toResponse(userPreferencesRepository.save(preferences));
    }

    private UserPreferences getOrCreateCurrentPreferencesEntity() {
        UUID profileId = currentUserProvider.getCurrentProfileId();
        return userPreferencesRepository.findById(profileId).orElseGet(() -> provisionPreferences(profileId));
    }

    private UserPreferences provisionPreferences(UUID profileId) {
        // `user_preferences.profile_id` tem FK para `profiles.id`: garante que o
        // perfil ja foi provisionado antes, para o caso de o cliente chamar
        // /me/preferences antes de qualquer chamada a /me.
        profileService.getCurrentProfile();

        UserPreferences preferences = new UserPreferences(profileId, DEFAULT_FONT_SIZE, DEFAULT_SOUND_ENABLED,
                DEFAULT_SHOW_TRANSLATION, null, DEFAULT_NOTIFICATIONS_ENABLED);
        try {
            return userPreferencesRepository.saveAndFlush(preferences);
        } catch (DataIntegrityViolationException concurrentInsert) {
            // Mesma corrida concorrente tratada em ProfileService.provisionProfile.
            return userPreferencesRepository.findById(profileId).orElseThrow(() -> concurrentInsert);
        }
    }
}
