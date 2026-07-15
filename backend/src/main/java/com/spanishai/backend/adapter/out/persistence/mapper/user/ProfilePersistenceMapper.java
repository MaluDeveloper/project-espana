package com.spanishai.backend.adapter.out.persistence.mapper.user;

import com.spanishai.backend.adapter.out.persistence.entity.ProfileJpaEntity;
import com.spanishai.backend.domain.model.Profile;
import org.springframework.stereotype.Component;

/**
 * Conversao manual (nao MapStruct): o id e final em ambos os lados e a entidade
 * JPA so aceita createdAt/updatedAt via listener de auditoria, entao nao ha
 * setter/construtor generico para o MapStruct escolher automaticamente.
 */
@Component
public class ProfilePersistenceMapper {

    public Profile toDomain(ProfileJpaEntity entity) {
        return new Profile(entity.getId(), entity.getName(), entity.getAvatarUrl(), entity.getLocale(),
                entity.getTimezone(), entity.getCreatedAt(), entity.getUpdatedAt());
    }

    public ProfileJpaEntity toEntity(Profile profile) {
        if (profile.getCreatedAt() != null) {
            // Profile ja existente (veio de toDomain/create): preserva createdAt para
            // que Persistable#isNew() volte false e o save() gere um UPDATE, nao um INSERT.
            return new ProfileJpaEntity(profile.getId(), profile.getName(), profile.getAvatarUrl(),
                    profile.getLocale(), profile.getTimezone(), profile.getCreatedAt());
        }
        return new ProfileJpaEntity(profile.getId(), profile.getName(), profile.getAvatarUrl(),
                profile.getLocale(), profile.getTimezone());
    }
}
