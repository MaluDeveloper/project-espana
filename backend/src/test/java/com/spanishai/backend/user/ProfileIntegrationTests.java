package com.spanishai.backend.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spanishai.backend.user.dto.ProfileUpdateRequest;
import com.spanishai.backend.user.repository.ProfileRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Ponta a ponta (contexto Spring completo + MockMvc) do modulo user/profile: exercita
 * GET/PUT /api/users/me com um Authentication de JWT simulado (SecurityMockMvcRequestPostProcessors.jwt()),
 * sem depender do JWKS real do Supabase -- a validacao de assinatura/issuer (Fase 0) ja
 * tem cobertura propria em Phase0EndpointTests; aqui o foco e o comportamento do
 * ProfileController/ProfileService a partir de um SecurityContext ja autenticado.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("local")
class ProfileIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @AfterEach
    void cleanUp() {
        profileRepository.deleteAll();
    }

    @Test
    void getMeProvisionsProfileLazilyOnFirstAuthenticatedRequest() throws Exception {
        UUID subjectId = UUID.randomUUID();

        mockMvc.perform(get("/api/users/me").with(jwtFor(subjectId,
                        token -> token.claim("email", "aluno.novo@example.com"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(subjectId.toString()))
                .andExpect(jsonPath("$.name").value("aluno.novo"))
                .andExpect(jsonPath("$.locale").value("pt"))
                .andExpect(jsonPath("$.timezone").value("America/Sao_Paulo"));

        assertThat(profileRepository.findById(subjectId)).isPresent();
    }

    @Test
    void getMeUsesUserMetadataFromGoogleOAuthWhenAvailable() throws Exception {
        UUID subjectId = UUID.randomUUID();

        mockMvc.perform(get("/api/users/me").with(jwtFor(subjectId, token -> token
                                .claim("email", "aluno@example.com")
                                .claim("user_metadata", Map.of(
                                        "full_name", "Aluno Google",
                                        "avatar_url", "https://lh3.googleusercontent.com/a/foto.jpg")))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Aluno Google"))
                .andExpect(jsonPath("$.avatarUrl").value("https://lh3.googleusercontent.com/a/foto.jpg"));
    }

    @Test
    void getMeReturnsSameProfileOnSecondRequestInsteadOfCreatingAnother() throws Exception {
        UUID subjectId = UUID.randomUUID();

        mockMvc.perform(get("/api/users/me").with(jwtFor(subjectId)))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/users/me").with(jwtFor(subjectId)))
                .andExpect(status().isOk());

        assertThat(profileRepository.count()).isEqualTo(1);
    }

    @Test
    void putMeUpdatesProfileFields() throws Exception {
        UUID subjectId = UUID.randomUUID();
        mockMvc.perform(get("/api/users/me").with(jwtFor(subjectId))).andExpect(status().isOk());

        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest(
                "Nome Atualizado", "https://example.com/avatar.png", "en", "Europe/Madrid");

        mockMvc.perform(put("/api/users/me")
                        .with(jwtFor(subjectId))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nome Atualizado"))
                .andExpect(jsonPath("$.avatarUrl").value("https://example.com/avatar.png"))
                .andExpect(jsonPath("$.locale").value("en"))
                .andExpect(jsonPath("$.timezone").value("Europe/Madrid"));

        assertThat(profileRepository.findById(subjectId).orElseThrow().getName()).isEqualTo("Nome Atualizado");
    }

    @Test
    void putMeProvisionsProfileWhenCalledBeforeAnyGet() throws Exception {
        UUID subjectId = UUID.randomUUID();
        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest("Direto No Put", null, "pt", "America/Sao_Paulo");

        mockMvc.perform(put("/api/users/me")
                        .with(jwtFor(subjectId))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Direto No Put"));

        assertThat(profileRepository.count()).isEqualTo(1);
    }

    @Test
    void putMeWithBlankNameReturns400() throws Exception {
        UUID subjectId = UUID.randomUUID();
        ProfileUpdateRequest invalidRequest = new ProfileUpdateRequest("", null, "pt", "America/Sao_Paulo");

        mockMvc.perform(put("/api/users/me")
                        .with(jwtFor(subjectId))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void putMeWithInvalidLocaleReturns400() throws Exception {
        UUID subjectId = UUID.randomUUID();
        ProfileUpdateRequest invalidRequest = new ProfileUpdateRequest("Nome", null, "fr", "America/Sao_Paulo");

        mockMvc.perform(put("/api/users/me")
                        .with(jwtFor(subjectId))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void putMeWithInvalidTimezoneReturns400() throws Exception {
        UUID subjectId = UUID.randomUUID();
        ProfileUpdateRequest invalidRequest = new ProfileUpdateRequest("Nome", null, "pt", "Nao/ExisteZona");

        mockMvc.perform(put("/api/users/me")
                        .with(jwtFor(subjectId))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getMeWithoutTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    private static JwtRequestPostProcessor jwtFor(UUID subjectId) {
        return jwt().jwt(token -> token.subject(subjectId.toString()));
    }

    private static JwtRequestPostProcessor jwtFor(UUID subjectId, Consumer<Jwt.Builder> claims) {
        return jwt().jwt(token -> claims.accept(token.subject(subjectId.toString())));
    }
}
