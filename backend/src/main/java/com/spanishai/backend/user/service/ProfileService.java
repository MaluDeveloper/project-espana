package com.spanishai.backend.user.service;

import com.spanishai.backend.common.exception.InvalidRequestException;
import com.spanishai.backend.security.CurrentUserProvider;
import com.spanishai.backend.user.dto.ProfileResponse;
import com.spanishai.backend.user.dto.ProfileUpdateRequest;
import com.spanishai.backend.user.entity.Profile;
import com.spanishai.backend.user.mapper.ProfileMapper;
import com.spanishai.backend.user.repository.ProfileRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DateTimeException;
import java.time.ZoneId;
import java.util.Map;
import java.util.UUID;

/**
 * Provisionamento lazy (BACKEND_ARCHITECTURE.md, secao 2.2, passo 6): a primeira
 * requisicao autenticada de um usuario sem linha em `profiles` cria essa linha na
 * hora, usando o `sub` do JWT como id e o restante do token (email/user_metadata)
 * como origem dos valores default -- funciona igual para cadastro por e-mail e por
 * Google, sem endpoint separado de "primeiro acesso".
 */
@Service
public class ProfileService {

    private static final String DEFAULT_LOCALE = "pt";
    private static final String DEFAULT_TIMEZONE = "America/Sao_Paulo";
    private static final String DEFAULT_NAME = "Usuario";

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;
    private final CurrentUserProvider currentUserProvider;

    public ProfileService(ProfileRepository profileRepository,
                           ProfileMapper profileMapper,
                           CurrentUserProvider currentUserProvider) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional
    public ProfileResponse getCurrentProfile() {
        return profileMapper.toResponse(getOrCreateCurrentProfileEntity());
    }

    @Transactional
    public ProfileResponse updateCurrentProfile(ProfileUpdateRequest request) {
        validateTimezone(request.timezone());
        Profile profile = getOrCreateCurrentProfileEntity();
        profileMapper.updateEntityFromRequest(request, profile);
        return profileMapper.toResponse(profileRepository.save(profile));
    }

    private Profile getOrCreateCurrentProfileEntity() {
        UUID profileId = currentUserProvider.getCurrentProfileId();
        return profileRepository.findById(profileId).orElseGet(() -> provisionProfile(profileId));
    }

    private Profile provisionProfile(UUID profileId) {
        Profile profile = new Profile(profileId, resolveDefaultName(), resolveDefaultAvatarUrl(),
                DEFAULT_LOCALE, DEFAULT_TIMEZONE);
        try {
            return profileRepository.saveAndFlush(profile);
        } catch (DataIntegrityViolationException concurrentInsert) {
            // Duas requisicoes concorrentes na primeira chamada do usuario (ex.: dupla
            // chamada do frontend) podem tentar provisionar ao mesmo tempo; quem perde
            // a corrida no banco (PK duplicada) so precisa reler a linha ja criada.
            return profileRepository.findById(profileId).orElseThrow(() -> concurrentInsert);
        }
    }

    private String resolveDefaultName() {
        Map<String, Object> metadata = currentUserProvider.getCurrentUserMetadata();
        String fullName = asNonBlankString(metadata.get("full_name"));
        if (fullName != null) {
            return fullName;
        }
        String name = asNonBlankString(metadata.get("name"));
        if (name != null) {
            return name;
        }
        return currentUserProvider.getCurrentEmail()
                .map(ProfileService::localPartOf)
                .filter(localPart -> !localPart.isBlank())
                .orElse(DEFAULT_NAME);
    }

    private String resolveDefaultAvatarUrl() {
        Map<String, Object> metadata = currentUserProvider.getCurrentUserMetadata();
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