package com.spanishai.backend.user.controller;

import com.spanishai.backend.user.dto.ProfileResponse;
import com.spanishai.backend.user.dto.ProfileUpdateRequest;
import com.spanishai.backend.user.service.ProfileService;
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
@Tag(name = "Perfil", description = "Perfil do usuario autenticado (provisionado via lazy provisioning)")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
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
}