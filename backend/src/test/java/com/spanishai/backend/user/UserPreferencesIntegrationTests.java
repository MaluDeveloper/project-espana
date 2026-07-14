package com.spanishai.backend.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spanishai.backend.user.dto.UserPreferencesUpdateRequest;
import com.spanishai.backend.user.repository.ProfileRepository;
import com.spanishai.backend.user.repository.UserPreferencesRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Espelha ProfileIntegrationTests: contexto Spring completo + MockMvc, JWT simulado.
 * `user_preferences.profile_id` tem FK para `profiles.id`, por isso um dos testes
 * cobre explicitamente o caso de /me/preferences ser chamado antes de qualquer
 * chamada a /me (UserPreferencesService precisa provisionar o profile primeiro).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("local")
class UserPreferencesIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @AfterEach
    void cleanUp() {
        userPreferencesRepository.deleteAll();
        profileRepository.deleteAll();
    }

    @Test
    void getMePreferencesProvisionsWithDefaultsOnFirstAuthenticatedRequest() throws Exception {
        UUID subjectId = UUID.randomUUID();

        mockMvc.perform(get("/api/users/me/preferences").with(jwtFor(subjectId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fontSize").value("normal"))
                .andExpect(jsonPath("$.soundEnabled").value(true))
                .andExpect(jsonPath("$.showTranslation").value(true))
                .andExpect(jsonPath("$.notificationsEnabled").value(true))
                .andExpect(jsonPath("$.reminderTime").doesNotExist());

        assertThat(userPreferencesRepository.findById(subjectId)).isPresent();
    }

    @Test
    void getMePreferencesAlsoProvisionsProfileWhenCalledBeforeAnyProfileRequest() throws Exception {
        UUID subjectId = UUID.randomUUID();

        mockMvc.perform(get("/api/users/me/preferences").with(jwtFor(subjectId)))
                .andExpect(status().isOk());

        assertThat(profileRepository.findById(subjectId)).isPresent();
        assertThat(userPreferencesRepository.findById(subjectId)).isPresent();
    }

    @Test
    void getMePreferencesReturnsSamePreferencesOnSecondRequestInsteadOfCreatingAnother() throws Exception {
        UUID subjectId = UUID.randomUUID();

        mockMvc.perform(get("/api/users/me/preferences").with(jwtFor(subjectId)))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/users/me/preferences").with(jwtFor(subjectId)))
                .andExpect(status().isOk());

        assertThat(userPreferencesRepository.count()).isEqualTo(1);
    }

    @Test
    void putMePreferencesUpdatesFields() throws Exception {
        UUID subjectId = UUID.randomUUID();
        mockMvc.perform(get("/api/users/me/preferences").with(jwtFor(subjectId))).andExpect(status().isOk());

        UserPreferencesUpdateRequest updateRequest = new UserPreferencesUpdateRequest(
                "large", false, false, LocalTime.of(20, 0), false);

        mockMvc.perform(put("/api/users/me/preferences")
                        .with(jwtFor(subjectId))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fontSize").value("large"))
                .andExpect(jsonPath("$.soundEnabled").value(false))
                .andExpect(jsonPath("$.showTranslation").value(false))
                .andExpect(jsonPath("$.reminderTime").value("20:00:00"))
                .andExpect(jsonPath("$.notificationsEnabled").value(false));

        assertThat(userPreferencesRepository.findById(subjectId).orElseThrow().getFontSize()).isEqualTo("large");
    }

    @Test
    void putMePreferencesProvisionsWhenCalledBeforeAnyGet() throws Exception {
        UUID subjectId = UUID.randomUUID();
        UserPreferencesUpdateRequest updateRequest = new UserPreferencesUpdateRequest(
                "normal", true, true, null, true);

        mockMvc.perform(put("/api/users/me/preferences")
                        .with(jwtFor(subjectId))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk());

        assertThat(userPreferencesRepository.count()).isEqualTo(1);
    }

    @Test
    void putMePreferencesWithInvalidFontSizeReturns400() throws Exception {
        UUID subjectId = UUID.randomUUID();
        UserPreferencesUpdateRequest invalidRequest = new UserPreferencesUpdateRequest(
                "huge", true, true, null, true);

        mockMvc.perform(put("/api/users/me/preferences")
                        .with(jwtFor(subjectId))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void putMePreferencesWithMalformedReminderTimeReturns400WithClearMessage() throws Exception {
        UUID subjectId = UUID.randomUUID();
        String malformedBody = """
                {
                    "fontSize": "normal",
                    "soundEnabled": true,
                    "showTranslation": true,
                    "reminderTime": { "hour": 14, "minute": 30, "second": 0, "nano": 0 },
                    "notificationsEnabled": true
                }
                """;

        mockMvc.perform(put("/api/users/me/preferences")
                        .with(jwtFor(subjectId))
                        .contentType("application/json")
                        .content(malformedBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Corpo da requisicao invalido ou malformado"));

        assertThat(userPreferencesRepository.count()).isZero();
    }

    @Test
    void getMePreferencesWithoutTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/users/me/preferences"))
                .andExpect(status().isUnauthorized());
    }

    private static JwtRequestPostProcessor jwtFor(UUID subjectId) {
        return jwt().jwt(token -> token.subject(subjectId.toString()));
    }
}
