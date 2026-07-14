package com.spanishai.backend.user.controller;

import com.spanishai.backend.user.dto.ProfileResponse;
import com.spanishai.backend.user.dto.ProfileUpdateRequest;
import com.spanishai.backend.user.dto.UserPreferencesResponse;
import com.spanishai.backend.user.dto.UserPreferencesUpdateRequest;
import com.spanishai.backend.user.service.ProfileService;
import com.spanishai.backend.user.service.UserPreferencesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Perfil", description = "Perfil e preferencias do usuario autenticado (provisionados via lazy provisioning)")
public class ProfileController {

    private final ProfileService profileService;
    private final UserPreferencesService userPreferencesService;

    public ProfileController(ProfileService profileService, UserPreferencesService userPreferencesService) {
        this.profileService = profileService;
        this.userPreferencesService = userPreferencesService;
    }

    @GetMapping("/me")
    @Operation(
            summary = "Retorna o perfil do usuario autenticado",
            description = "Se for a primeira requisicao autenticada desse usuario e o perfil "
                    + "ainda nao existir, ele e criado automaticamente (provisionamento lazy) "
                    + "a partir do `sub` e dos metadados do token JWT do Supabase."
    )
    public ProfileResponse getCurrentProfile() {
        return profileService.getCurrentProfile();
    }

    @PutMapping("/me")
    @Operation(summary = "Atualiza o perfil do usuario autenticado")
    public ProfileResponse updateCurrentProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        return profileService.updateCurrentProfile(request);
    }

    @GetMapping("/me/preferences")
    @Operation(
            summary = "Retorna as preferencias do usuario autenticado",
            description = "Se ainda nao existirem, sao provisionadas com valores default "
                    + "na primeira requisicao (mesmo padrao do perfil)."
    )
    public UserPreferencesResponse getCurrentPreferences() {
        return userPreferencesService.getCurrentPreferences();
    }

    @PutMapping("/me/preferences")
    @Operation(summary = "Atualiza as preferencias do usuario autenticado")
    public UserPreferencesResponse updateCurrentPreferences(@Valid @RequestBody UserPreferencesUpdateRequest request) {
        return userPreferencesService.updateCurrentPreferences(request);
    }
}