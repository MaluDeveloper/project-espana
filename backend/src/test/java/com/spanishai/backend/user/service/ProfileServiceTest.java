package com.spanishai.backend.user.service;

import com.spanishai.backend.common.exception.InvalidRequestException;
import com.spanishai.backend.security.CurrentUserProvider;
import com.spanishai.backend.user.dto.ProfileResponse;
import com.spanishai.backend.user.dto.ProfileUpdateRequest;
import com.spanishai.backend.user.entity.Profile;
import com.spanishai.backend.user.mapper.ProfileMapper;
import com.spanishai.backend.user.mapper.ProfileMapperImpl;
import com.spanishai.backend.user.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

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
 * Testes de unidade da regra de negocio do provisionamento lazy (BACKEND_ARCHITECTURE.md
 * 2.2, passo 6) e da atualizacao de perfil, isolados de banco/Spring via mocks do
 * ProfileRepository e do CurrentUserProvider. Usa o ProfileMapperImpl gerado pelo
 * MapStruct diretamente -- nao tem dependencias, entao nao precisa de mock.
 */
@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    private final ProfileMapper profileMapper = new ProfileMapperImpl();

    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        profileService = new ProfileService(profileRepository, profileMapper, currentUserProvider);
    }

    @Test
    void getCurrentProfileProvisionsProfileUsingUserMetadataWhenMissing() {
        UUID profileId = UUID.randomUUID();
        when(currentUserProvider.getCurrentProfileId()).thenReturn(profileId);
        when(profileRepository.findById(profileId)).thenReturn(Optional.empty());
        when(currentUserProvider.getCurrentUserMetadata())
                .thenReturn(Map.of("full_name", "Joana da Silva", "avatar_url", "https://example.com/a.png"));
        when(profileRepository.saveAndFlush(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProfileResponse response = profileService.getCurrentProfile();

        assertThat(response.id()).isEqualTo(profileId);
        assertThat(response.name()).isEqualTo("Joana da Silva");
        assertThat(response.avatarUrl()).isEqualTo("https://example.com/a.png");
        assertThat(response.locale()).isEqualTo("pt");
        assertThat(response.timezone()).isEqualTo("America/Sao_Paulo");
        verify(profileRepository).saveAndFlush(any(Profile.class));
    }

    @Test
    void getCurrentProfileFallsBackToEmailLocalPartWhenNoNameMetadata() {
        UUID profileId = UUID.randomUUID();
        when(currentUserProvider.getCurrentProfileId()).thenReturn(profileId);
        when(profileRepository.findById(profileId)).thenReturn(Optional.empty());
        when(currentUserProvider.getCurrentUserMetadata()).thenReturn(Map.of());
        when(currentUserProvider.getCurrentEmail()).thenReturn(Optional.of("aluno.dez@example.com"));
        when(profileRepository.saveAndFlush(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProfileResponse response = profileService.getCurrentProfile();

        assertThat(response.name()).isEqualTo("aluno.dez");
        assertThat(response.avatarUrl()).isNull();
    }

    @Test
    void getCurrentProfileFallsBackToDefaultNameWhenNoMetadataOrEmail() {
        UUID profileId = UUID.randomUUID();
        when(currentUserProvider.getCurrentProfileId()).thenReturn(profileId);
        when(profileRepository.findById(profileId)).thenReturn(Optional.empty());
        when(currentUserProvider.getCurrentUserMetadata()).thenReturn(Map.of());
        when(currentUserProvider.getCurrentEmail()).thenReturn(Optional.empty());
        when(profileRepository.saveAndFlush(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProfileResponse response = profileService.getCurrentProfile();

        assertThat(response.name()).isEqualTo("Usuario");
    }

    @Test
    void getCurrentProfileReturnsExistingProfileWithoutProvisioning() {
        UUID profileId = UUID.randomUUID();
        Profile existing = new Profile(profileId, "Ja Existe", null, "en", "Europe/Madrid");
        when(currentUserProvider.getCurrentProfileId()).thenReturn(profileId);
        when(profileRepository.findById(profileId)).thenReturn(Optional.of(existing));

        ProfileResponse response = profileService.getCurrentProfile();

        assertThat(response.name()).isEqualTo("Ja Existe");
        assertThat(response.locale()).isEqualTo("en");
        verify(profileRepository, never()).saveAndFlush(any());
        verify(profileRepository, never()).save(any());
        verify(currentUserProvider, never()).getCurrentUserMetadata();
    }

    @Test
    void getCurrentProfileRereadsExistingRowWhenConcurrentProvisioningLosesTheRace() {
        UUID profileId = UUID.randomUUID();
        Profile winnerRow = new Profile(profileId, "Criado Pela Outra Requisicao", null, "pt", "America/Sao_Paulo");
        when(currentUserProvider.getCurrentProfileId()).thenReturn(profileId);
        when(profileRepository.findById(profileId))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(winnerRow));
        when(currentUserProvider.getCurrentUserMetadata()).thenReturn(Map.of());
        when(currentUserProvider.getCurrentEmail()).thenReturn(Optional.empty());
        when(profileRepository.saveAndFlush(any(Profile.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate key"));

        ProfileResponse response = profileService.getCurrentProfile();

        assertThat(response.name()).isEqualTo("Criado Pela Outra Requisicao");
    }

    @Test
    void updateCurrentProfileUpdatesFieldsAndPersists() {
        UUID profileId = UUID.randomUUID();
        Profile existing = new Profile(profileId, "Nome Antigo", null, "pt", "America/Sao_Paulo");
        when(currentUserProvider.getCurrentProfileId()).thenReturn(profileId);
        when(profileRepository.findById(profileId)).thenReturn(Optional.of(existing));
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProfileUpdateRequest request = new ProfileUpdateRequest(
                "Nome Novo", "https://example.com/novo.png", "en", "Europe/Madrid");

        ProfileResponse response = profileService.updateCurrentProfile(request);

        assertThat(response.name()).isEqualTo("Nome Novo");
        assertThat(response.avatarUrl()).isEqualTo("https://example.com/novo.png");
        assertThat(response.locale()).isEqualTo("en");
        assertThat(response.timezone()).isEqualTo("Europe/Madrid");
    }

    @Test
    void updateCurrentProfileRejectsInvalidTimezone() {
        ProfileUpdateRequest request = new ProfileUpdateRequest("Nome", null, "pt", "Nao/ExisteZona");

        assertThatThrownBy(() -> profileService.updateCurrentProfile(request))
                .isInstanceOf(InvalidRequestException.class);

        verify(profileRepository, never()).findById(any());
    }
}
