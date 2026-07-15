package com.spanishai.backend.adapter.out.persistence.user;

import com.spanishai.backend.adapter.out.persistence.entity.ProfileJpaEntity;
import com.spanishai.backend.adapter.out.persistence.mapper.user.ProfilePersistenceMapper;
import com.spanishai.backend.domain.model.Profile;
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
 * Cobre a corrida concorrente de provisionamento (antes testada em ProfileServiceTest,
 * agora responsabilidade deste adapter): duas requisicoes tentando criar o mesmo
 * perfil ao mesmo tempo -- quem perde a corrida no banco (PK duplicada) precisa reler
 * a linha ja criada em vez de propagar o erro.
 */
@ExtendWith(MockitoExtension.class)
class ProfilePersistenceAdapterTest {

    @Mock
    private ProfileJpaRepository jpaRepository;

    private final ProfilePersistenceMapper mapper = new ProfilePersistenceMapper();

    private ProfilePersistenceAdapter adapter;

    @BeforeEach
    void setUp() {
        adapter = new ProfilePersistenceAdapter(jpaRepository, mapper);
    }

    @Test
    void createRereadsExistingRowWhenConcurrentInsertLosesTheRace() {
        UUID profileId = UUID.randomUUID();
        Profile toCreate = new Profile(profileId, "Novo", null, "pt", "America/Sao_Paulo");
        ProfileJpaEntity winnerRow = new ProfileJpaEntity(profileId, "Criado Pela Outra Requisicao", null,
                "pt", "America/Sao_Paulo");

        when(jpaRepository.saveAndFlush(any(ProfileJpaEntity.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate key"));
        when(jpaRepository.findById(profileId)).thenReturn(Optional.of(winnerRow));

        Profile result = adapter.create(toCreate);

        assertThat(result.getName()).isEqualTo("Criado Pela Outra Requisicao");
    }
}
