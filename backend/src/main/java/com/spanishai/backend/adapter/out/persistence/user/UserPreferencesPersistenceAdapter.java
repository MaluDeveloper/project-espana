package com.spanishai.backend.adapter.out.persistence.user;

import com.spanishai.backend.adapter.out.persistence.mapper.user.UserPreferencesPersistenceMapper;
import com.spanishai.backend.domain.model.UserPreferences;
import com.spanishai.backend.domain.ports.out.user.UserPreferencesRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class UserPreferencesPersistenceAdapter implements UserPreferencesRepository {

    private final UserPreferencesJpaRepository jpaRepository;
    private final UserPreferencesPersistenceMapper mapper;

    public UserPreferencesPersistenceAdapter(UserPreferencesJpaRepository jpaRepository,
                                              UserPreferencesPersistenceMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<UserPreferences> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public UserPreferences save(UserPreferences preferences) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(preferences)));
    }

    @Override
    public UserPreferences create(UserPreferences preferences) {
        try {
            return mapper.toDomain(jpaRepository.saveAndFlush(mapper.toEntity(preferences)));
        } catch (DataIntegrityViolationException concurrentInsert) {
            // Mesma corrida concorrente tratada em ProfilePersistenceAdapter.create.
            return findById(preferences.getId()).orElseThrow(() -> concurrentInsert);
        }
    }
}
