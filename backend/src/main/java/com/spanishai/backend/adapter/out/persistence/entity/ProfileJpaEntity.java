package com.spanishai.backend.adapter.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.domain.Persistable;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * `id` NAO e gerado pelo Hibernate/Postgres: e sempre o mesmo UUID de auth.users.id
 * (claim `sub` do JWT do Supabase), atribuido explicitamente pelo ProfilePersistenceAdapter
 * no provisionamento lazy. Por isso esta entidade nao estende BaseJpaEntity (cuja estrategia
 * de geracao de id e incompativel com um id atribuido externamente) e implementa
 * Persistable: com um id sempre nao-nulo, a heuristica default do Spring Data (id nulo
 * = entidade nova) trataria toda entidade como existente e chamaria merge() em vez de
 * persist() -- isNew() aqui usa createdAt (so preenchido pelo listener de auditoria no
 * @PrePersist) para diferenciar corretamente insercao de atualizacao.
 */
@Entity
@Table(name = "profiles")
@EntityListeners(AuditingEntityListener.class)
public class ProfileJpaEntity implements Persistable<UUID> {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(nullable = false)
    private String locale;

    @Column(nullable = false)
    private String timezone;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ProfileJpaEntity() {
        // JPA
    }

    public ProfileJpaEntity(UUID id, String name, String avatarUrl, String locale, String timezone) {
        this.id = Objects.requireNonNull(id, "id");
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.locale = locale;
        this.timezone = timezone;
    }

    /**
     * Usado pelo ProfilePersistenceMapper ao reconstruir a entidade para um UPDATE
     * de uma linha ja existente: com createdAt preenchido, Persistable#isNew()
     * retorna false e o Spring Data chama merge() em vez de persist() (que falharia
     * com PK duplicada). O valor em si nunca e escrito de volta no banco --
     * `created_at` e `updatable = false`.
     */
    public ProfileJpaEntity(UUID id, String name, String avatarUrl, String locale, String timezone,
                             Instant createdAt) {
        this(id, name, avatarUrl, locale, timezone);
        this.createdAt = createdAt;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public boolean isNew() {
        return createdAt == null;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
