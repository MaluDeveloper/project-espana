package com.spanishai.backend.application.service.user;

import com.spanishai.backend.domain.exception.InvalidRequestException;
import com.spanishai.backend.domain.model.Profile;
import com.spanishai.backend.domain.ports.in.user.GetProfileUseCase;
import com.spanishai.backend.domain.ports.in.user.UpdateProfileUseCase;
import com.spanishai.backend.domain.ports.out.user.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DateTimeException;
import java.time.ZoneId;
import java.util.Map;
import java.util.UUID;

/**
 * Provisionamento lazy: a primeira requisicao autenticada de um usuario sem linha
 * em `profiles` cria essa linha na hora, usando o `sub` do JWT como id e o restante
 * do token (email/user_metadata, resolvidos pelo adapter/in/rest a partir do
 * CurrentUserProvider) como origem dos valores default -- funciona igual para
 * cadastro por e-mail e por Google, sem endpoint separado de "primeiro acesso".
 */
@Service
public class ProfileService implements GetProfileUseCase, UpdateProfileUseCase {

    private static final String DEFAULT_LOCALE = "pt";
    private static final String DEFAULT_TIMEZONE = "America/Sao_Paulo";
    private static final String DEFAULT_NAME = "Usuario";

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    @Transactional
    public Profile getCurrentProfile(GetProfileCommand command) {
        return getOrCreateProfile(command.profileId(), command.email(), command.userMetadata());
    }

    @Override
    @Transactional
    public Profile updateCurrentProfile(UpdateProfileCommand command) {
        validateTimezone(command.timezone());
        Profile profile = getOrCreateProfile(command.profileId(), command.email(), command.userMetadata());
        profile.update(command.name(), command.avatarUrl(), command.locale(), command.timezone());
        return profileRepository.save(profile);
    }

    private Profile getOrCreateProfile(UUID profileId, String email, Map<String, Object> userMetadata) {
        return profileRepository.findById(profileId)
                .orElseGet(() -> provisionProfile(profileId, email, userMetadata));
    }

    private Profile provisionProfile(UUID profileId, String email, Map<String, Object> userMetadata) {
        Profile profile = new Profile(profileId, resolveDefaultName(email, userMetadata),
                resolveDefaultAvatarUrl(userMetadata), DEFAULT_LOCALE, DEFAULT_TIMEZONE);
        return profileRepository.create(profile);
    }

    private static String resolveDefaultName(String email, Map<String, Object> metadata) {
        String fullName = asNonBlankString(metadata.get("full_name"));
        if (fullName != null) {
            return fullName;
        }
        String name = asNonBlankString(metadata.get("name"));
        if (name != null) {
            return name;
        }
        if (email != null) {
            String localPart = localPartOf(email);
            if (!localPart.isBlank()) {
                return localPart;
            }
        }
        return DEFAULT_NAME;
    }

    private static String resolveDefaultAvatarUrl(Map<String, Object> metadata) {
        String avatarUrl = asNonBlankString(metadata.get("avatar_url"));
        if (avatarUrl != null) {
            return avatarUrl;
        }
        return asNonBlankString(metadata.get("picture"));
    }

    private static String asNonBlankString(Object value) {
        return value instanceof String s && !s.isBlank() ? s : null;
    }

    private static String localPartOf(String email) {
        int at = email.indexOf('@');
        return at >= 0 ? email.substring(0, at) : email;
    }

    private static void validateTimezone(String timezone) {
        try {
            ZoneId.of(timezone);
        } catch (DateTimeException e) {
            throw new InvalidRequestException("timezone invalido: " + timezone);
        }
    }
}
