package com.spanishai.backend.adapter.out.persistence.user;

import com.spanishai.backend.adapter.out.persistence.mapper.user.ProfilePersistenceMapper;
import com.spanishai.backend.domain.model.Profile;
import com.spanishai.backend.domain.ports.out.user.ProfileRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class ProfilePersistenceAdapter implements ProfileRepository {

    private final ProfileJpaRepository jpaRepository;
    private final ProfilePersistenceMapper mapper;

    public ProfilePersistenceAdapter(ProfileJpaRepository jpaRepository, ProfilePersistenceMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Profile> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Profile save(Profile profile) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(profile)));
    }

    @Override
    public Profile create(Profile profile) {
        try {
            return mapper.toDomain(jpaRepository.saveAndFlush(mapper.toEntity(profile)));
        } catch (DataIntegrityViolationException concurrentInsert) {
            // Duas requisicoes concorrentes na primeira chamada do usuario (ex.: dupla
            // chamada do frontend) podem tentar provisionar ao mesmo tempo; quem perde
            // a corrida no banco (PK duplicada) so precisa reler a linha ja criada.
            return findById(profile.getId()).orElseThrow(() -> concurrentInsert);
        }
    }
}
