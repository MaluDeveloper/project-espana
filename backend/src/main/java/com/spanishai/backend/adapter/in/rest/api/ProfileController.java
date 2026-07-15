package com.spanishai.backend.adapter.in.rest.api;

import com.spanishai.backend.adapter.in.rest.request.user.ProfileUpdateRequest;
import com.spanishai.backend.adapter.in.rest.request.user.UserPreferencesUpdateRequest;
import com.spanishai.backend.adapter.in.rest.response.user.ProfileResponse;
import com.spanishai.backend.adapter.in.rest.response.user.UserPreferencesResponse;
import com.spanishai.backend.adapter.in.rest.mapper.user.ProfileRestMapper;
import com.spanishai.backend.adapter.in.rest.mapper.user.UserPreferencesRestMapper;
import com.spanishai.backend.domain.ports.in.user.GetPreferencesUseCase;
import com.spanishai.backend.domain.ports.in.user.GetPreferencesUseCase.GetPreferencesCommand;
import com.spanishai.backend.domain.ports.in.user.GetProfileUseCase;
import com.spanishai.backend.domain.ports.in.user.GetProfileUseCase.GetProfileCommand;
import com.spanishai.backend.domain.ports.in.user.UpdatePreferencesUseCase;
import com.spanishai.backend.domain.ports.in.user.UpdatePreferencesUseCase.UpdatePreferencesCommand;
import com.spanishai.backend.domain.ports.in.user.UpdateProfileUseCase;
import com.spanishai.backend.domain.ports.in.user.UpdateProfileUseCase.UpdateProfileCommand;
import com.spanishai.backend.security.CurrentUserProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Perfil", description = "Perfil e preferencias do usuario autenticado (provisionados via lazy provisioning)")
public class ProfileController {

    private final GetProfileUseCase getProfileUseCase;
    private final UpdateProfileUseCase updateProfileUseCase;
    private final GetPreferencesUseCase getPreferencesUseCase;
    private final UpdatePreferencesUseCase updatePreferencesUseCase;
    private final ProfileRestMapper profileRestMapper;
    private final UserPreferencesRestMapper userPreferencesRestMapper;
    private final CurrentUserProvider currentUserProvider;

    public ProfileController(GetProfileUseCase getProfileUseCase,
                              UpdateProfileUseCase updateProfileUseCase,
                              GetPreferencesUseCase getPreferencesUseCase,
                              UpdatePreferencesUseCase updatePreferencesUseCase,
                              ProfileRestMapper profileRestMapper,
                              UserPreferencesRestMapper userPreferencesRestMapper,
                              CurrentUserProvider currentUserProvider) {
        this.getProfileUseCase = getProfileUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
        this.getPreferencesUseCase = getPreferencesUseCase;
        this.updatePreferencesUseCase = updatePreferencesUseCase;
        this.profileRestMapper = profileRestMapper;
        this.userPreferencesRestMapper = userPreferencesRestMapper;
        this.currentUserProvider = currentUserProvider;
    }

    @GetMapping("/me")
    @Operation(
            summary = "Retorna o perfil do usuario autenticado",
            description = "Se for a primeira requisicao autenticada desse usuario e o perfil "
                    + "ainda nao existir, ele e criado automaticamente (provisionamento lazy) "
                    + "a partir do `sub` e dos metadados do token JWT do Supabase."
    )
    public ProfileResponse getCurrentProfile() {
        return profileRestMapper.toResponse(getProfileUseCase.getCurrentProfile(currentProfileCommand()));
    }

    @PutMapping("/me")
    @Operation(summary = "Atualiza o perfil do usuario autenticado")
    public ProfileResponse updateCurrentProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        UpdateProfileCommand command = new UpdateProfileCommand(currentUserProvider.getCurrentProfileId(),
                currentEmail(), currentMetadata(), request.name(), request.avatarUrl(), request.locale(),
                request.timezone());
        return profileRestMapper.toResponse(updateProfileUseCase.updateCurrentProfile(command));
    }

    @GetMapping("/me/preferences")
    @Operation(
            summary = "Retorna as preferencias do usuario autenticado",
            description = "Se ainda nao existirem, sao provisionadas com valores default "
                    + "na primeira requisicao (mesmo padrao do perfil)."
    )
    public UserPreferencesResponse getCurrentPreferences() {
        return userPreferencesRestMapper.toResponse(
                getPreferencesUseCase.getCurrentPreferences(currentPreferencesCommand()));
    }

    @PutMapping("/me/preferences")
    @Operation(summary = "Atualiza as preferencias do usuario autenticado")
    public UserPreferencesResponse updateCurrentPreferences(@Valid @RequestBody UserPreferencesUpdateRequest request) {
        UpdatePreferencesCommand command = new UpdatePreferencesCommand(currentUserProvider.getCurrentProfileId(),
                currentEmail(), currentMetadata(), request.fontSize(), request.soundEnabled(),
                request.showTranslation(), request.reminderTime(), request.notificationsEnabled());
        return userPreferencesRestMapper.toResponse(updatePreferencesUseCase.updateCurrentPreferences(command));
    }

    private GetProfileCommand currentProfileCommand() {
        return new GetProfileCommand(currentUserProvider.getCurrentProfileId(), currentEmail(), currentMetadata());
    }

    private GetPreferencesCommand currentPreferencesCommand() {
        return new GetPreferencesCommand(currentUserProvider.getCurrentProfileId(), currentEmail(), currentMetadata());
    }

    private String currentEmail() {
        return currentUserProvider.getCurrentEmail().orElse(null);
    }

    private Map<String, Object> currentMetadata() {
        return currentUserProvider.getCurrentUserMetadata();
    }
}
