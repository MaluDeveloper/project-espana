package com.spanishai.backend.domain.ports.out.user;

import com.spanishai.backend.domain.model.Profile;

import java.util.Optional;
import java.util.UUID;

public interface ProfileRepository {

    Optional<Profile> findById(UUID id);

    Profile save(Profile profile);

    /**
     * Insere um perfil novo. Se outra requisicao concorrente ja tiver inserido a
     * mesma linha (mesmo id) entre o findById e este create, a implementacao deve
     * relê-la e devolver a linha vencedora em vez de propagar erro -- essa e uma
     * garantia do adapter, nao uma preocupacao de quem chama a porta.
     */
    Profile create(Profile profile);
}
