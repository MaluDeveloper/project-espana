package com.spanishai.backend.application.service.user;

import com.spanishai.backend.domain.model.UserPreferences;
import com.spanishai.backend.domain.ports.in.user.GetPreferencesUseCase;
import com.spanishai.backend.domain.ports.in.user.GetProfileUseCase;
import com.spanishai.backend.domain.ports.in.user.UpdatePreferencesUseCase;
import com.spanishai.backend.domain.ports.out.user.UserPreferencesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Provisionamento lazy igual ao de ProfileService: a primeira leitura/escrita de
 * preferencias de um usuario sem linha em `user_preferences` cria a linha com os
 * mesmos defaults do frontend (ver frontend/src/lib/preferences.ts).
 */
@Service
public class UserPreferencesService implements GetPreferencesUseCase, UpdatePreferencesUseCase {

    private static final String DEFAULT_FONT_SIZE = "normal";
    private static final boolean DEFAULT_SOUND_ENABLED = true;
    private static final boolean DEFAULT_SHOW_TRANSLATION = true;
    private static final boolean DEFAULT_NOTIFICATIONS_ENABLED = true;

    private final UserPreferencesRepository userPreferencesRepository;
    private final GetProfileUseCase getProfileUseCase;

    public UserPreferencesService(UserPreferencesRepository userPreferencesRepository,
                                   GetProfileUseCase getProfileUseCase) {
        this.userPreferencesRepository = userPreferencesRepository;
        this.getProfileUseCase = getProfileUseCase;
    }

    @Override
    @Transactional
    public UserPreferences getCurrentPreferences(GetPreferencesCommand command) {
        return getOrCreatePreferences(command);
    }

    @Override
    @Transactional
    public UserPreferences updateCurrentPreferences(UpdatePreferencesCommand command) {
        UserPreferences preferences = getOrCreatePreferences(
                new GetPreferencesCommand(command.profileId(), command.email(), command.userMetadata()));
        preferences.update(command.fontSize(), command.soundEnabled(), command.showTranslation(),
                command.reminderTime(), command.notificationsEnabled());
        return userPreferencesRepository.save(preferences);
    }

    private UserPreferences getOrCreatePreferences(GetPreferencesCommand command) {
        return userPreferencesRepository.findById(command.profileId())
                .orElseGet(() -> provisionPreferences(command));
    }

    private UserPreferences provisionPreferences(GetPreferencesCommand command) {
        // `user_preferences.profile_id` tem FK para `profiles.id`: garante que o
        // perfil ja foi provisionado antes, para o caso de o cliente chamar
        // /me/preferences antes de qualquer chamada a /me.
        getProfileUseCase.getCurrentProfile(
                new GetProfileUseCase.GetProfileCommand(command.profileId(), command.email(), command.userMetadata()));

        UserPreferences preferences = new UserPreferences(command.profileId(), DEFAULT_FONT_SIZE,
                DEFAULT_SOUND_ENABLED, DEFAULT_SHOW_TRANSLATION, null, DEFAULT_NOTIFICATIONS_ENABLED);
        return userPreferencesRepository.create(preferences);
    }
}
