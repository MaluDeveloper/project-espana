package com.spanishai.backend.adapter.out.persistence.mapper.user;

import com.spanishai.backend.adapter.out.persistence.entity.UserPreferencesJpaEntity;
import com.spanishai.backend.domain.model.UserPreferences;
import org.springframework.stereotype.Component;

/**
 * Conversao manual pelo mesmo motivo de ProfilePersistenceMapper.
 */
@Component
public class UserPreferencesPersistenceMapper {

    public UserPreferences toDomain(UserPreferencesJpaEntity entity) {
        return new UserPreferences(entity.getId(), entity.getFontSize(), entity.isSoundEnabled(),
                entity.isShowTranslation(), entity.getReminderTime(), entity.isNotificationsEnabled(),
                entity.getCreatedAt(), entity.getUpdatedAt());
    }

    public UserPreferencesJpaEntity toEntity(UserPreferences preferences) {
        if (preferences.getCreatedAt() != null) {
            // Preferences ja existentes (vieram de toDomain/create): preserva createdAt
            // para que Persistable#isNew() volte false e o save() gere um UPDATE.
            return new UserPreferencesJpaEntity(preferences.getId(), preferences.getFontSize(),
                    preferences.isSoundEnabled(), preferences.isShowTranslation(), preferences.getReminderTime(),
                    preferences.isNotificationsEnabled(), preferences.getCreatedAt());
        }
        return new UserPreferencesJpaEntity(preferences.getId(), preferences.getFontSize(),
                preferences.isSoundEnabled(), preferences.isShowTranslation(), preferences.getReminderTime(),
                preferences.isNotificationsEnabled());
    }
}
