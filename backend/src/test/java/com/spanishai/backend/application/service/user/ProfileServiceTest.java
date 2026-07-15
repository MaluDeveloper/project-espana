package com.spanishai.backend.application.service.user;

import com.spanishai.backend.domain.exception.InvalidRequestException;
import com.spanishai.backend.domain.model.Profile;
import com.spanishai.backend.domain.ports.in.user.GetProfileUseCase.GetProfileCommand;
import com.spanishai.backend.domain.ports.in.user.UpdateProfileUseCase.UpdateProfileCommand;
import com.spanishai.backend.domain.ports.out.user.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Testes de unidade da regra de negocio do provisionamento lazy e da atualizacao
 * de perfil, isolados de banco/Spring/Security via mock do ProfileRepository (porta
 * de saida do dominio). A corrida concorrente de insercao (duas requisicoes tentando
 * provisionar o mesmo perfil ao mesmo tempo) e responsabilidade do adapter de
 * persistencia agora -- ver ProfilePersistenceAdapterTest.
 */
@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        profileService = new ProfileService(profileRepository);
    }

    @Test
    void getCurrentProfileProvisionsProfileUsingUserMetadataWhenMissing() {
        UUID profileId = UUID.randomUUID();
        when(profileRepository.findById(profileId)).thenReturn(Optional.empty());
        when(profileRepository.create(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Profile response = profileService.getCurrentProfile(new GetProfileCommand(profileId, null,
                Map.of("full_name", "Joana da Silva", "avatar_url", "https://example.com/a.png")));

        assertThat(response.getId()).isEqualTo(profileId);
        assertThat(response.getName()).isEqualTo("Joana da Silva");
        assertThat(response.getAvatarUrl()).isEqualTo("https://example.com/a.png");
        assertThat(response.getLocale()).isEqualTo("pt");
        assertThat(response.getTimezone()).isEqualTo("America/Sao_Paulo");
        verify(profileRepository).create(any(Profile.class));
    }

    @Test
    void getCurrentProfileFallsBackToEmailLocalPartWhenNoNameMetadata() {
        UUID profileId = UUID.randomUUID();
        when(profileRepository.findById(profileId)).thenReturn(Optional.empty());
        when(profileRepository.create(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Profile response = profileService.getCurrentProfile(
                new GetProfileCommand(profileId, "aluno.dez@example.com", Map.of()));

        assertThat(response.getName()).isEqualTo("aluno.dez");
        assertThat(response.getAvatarUrl()).isNull();
    }

    @Test
    void getCurrentProfileFallsBackToDefaultNameWhenNoMetadataOrEmail() {
        UUID profileId = UUID.randomUUID();
        when(profileRepository.findById(profileId)).thenReturn(Optional.empty());
        when(profileRepository.create(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Profile response = profileService.getCurrentProfile(new GetProfileCommand(profileId, null, Map.of()));

        assertThat(response.getName()).isEqualTo("Usuario");
    }

    @Test
    void getCurrentProfileReturnsExistingProfileWithoutProvisioning() {
        UUID profileId = UUID.randomUUID();
        Profile existing = new Profile(profileId, "Ja Existe", null, "en", "Europe/Madrid");
        when(profileRepository.findById(profileId)).thenReturn(Optional.of(existing));

        Profile response = profileService.getCurrentProfile(new GetProfileCommand(profileId, null, Map.of()));

        assertThat(response.getName()).isEqualTo("Ja Existe");
        assertThat(response.getLocale()).isEqualTo("en");
        verify(profileRepository, never()).create(any());
        verify(profileRepository, never()).save(any());
    }

    @Test
    void updateCurrentProfileUpdatesFieldsAndPersists() {
        UUID profileId = UUID.randomUUID();
        Profile existing = new Profile(profileId, "Nome Antigo", null, "pt", "America/Sao_Paulo");
        when(profileRepository.findById(profileId)).thenReturn(Optional.of(existing));
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateProfileCommand command = new UpdateProfileCommand(profileId, null, Map.of(),
                "Nome Novo", "https://example.com/novo.png", "en", "Europe/Madrid");

        Profile response = profileService.updateCurrentProfile(command);

        assertThat(response.getName()).isEqualTo("Nome Novo");
        assertThat(response.getAvatarUrl()).isEqualTo("https://example.com/novo.png");
        assertThat(response.getLocale()).isEqualTo("en");
        assertThat(response.getTimezone()).isEqualTo("Europe/Madrid");
    }

    @Test
    void updateCurrentProfileRejectsInvalidTimezone() {
        UpdateProfileCommand command = new UpdateProfileCommand(UUID.randomUUID(), null, Map.of(),
                "Nome", null, "pt", "Nao/ExisteZona");

        assertThatThrownBy(() -> profileService.updateCurrentProfile(command))
                .isInstanceOf(InvalidRequestException.class);

        verify(profileRepository, never()).findById(any());
    }
}
