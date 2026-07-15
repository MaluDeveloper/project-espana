package com.spanishai.backend.adapter.out.persistence.user;

import com.spanishai.backend.adapter.out.persistence.entity.UserPreferencesJpaEntity;
import com.spanishai.backend.adapter.out.persistence.mapper.user.UserPreferencesPersistenceMapper;
import com.spanishai.backend.domain.model.UserPreferences;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Mesma corrida concorrente de ProfilePersistenceAdapterTest, para user_preferences.
 */
@ExtendWith(MockitoExtension.class)
class UserPreferencesPersistenceAdapterTest {

    @Mock
    private UserPreferencesJpaRepository jpaRepository;

    private final UserPreferencesPersistenceMapper mapper = new UserPreferencesPersistenceMapper();

    private UserPreferencesPersistenceAdapter adapter;

    @BeforeEach
    void setUp() {
        adapter = new UserPreferencesPersistenceAdapter(jpaRepository, mapper);
    }

    @Test
    void createRereadsExistingRowWhenConcurrentInsertLosesTheRace() {
        UUID profileId = UUID.randomUUID();
        UserPreferences toCreate = new UserPreferences(profileId, "normal", true, true, null, true);
        UserPreferencesJpaEntity winnerRow = new UserPreferencesJpaEntity(profileId, "large", false, false,
                null, false);

        when(jpaRepository.saveAndFlush(any(UserPreferencesJpaEntity.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate key"));
        when(jpaRepository.findById(profileId)).thenReturn(Optional.of(winnerRow));

        UserPreferences result = adapter.create(toCreate);

        assertThat(result.getFontSize()).isEqualTo("large");
    }
}
