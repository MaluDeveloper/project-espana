package com.spanishai.backend.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * `id` e sempre o mesmo UUID de auth.users.id (claim `sub` do JWT do Supabase),
 * atribuido explicitamente pelo ProfileService no provisionamento lazy -- nunca
 * gerado pelo banco (ver ProfileJpaEntity, camada de persistencia, para o porque
 * disso importa no mapeamento JPA).
 */
public class Profile {

    private final UUID id;
    private String name;
    private String avatarUrl;
    private String locale;
    private String timezone;
    private final Instant createdAt;
    private final Instant updatedAt;

    public Profile(UUID id, String name, String avatarUrl, String locale, String timezone) {
        this(id, name, avatarUrl, locale, timezone, null, null);
    }

    public Profile(UUID id, String name, String avatarUrl, String locale, String timezone,
                    Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id, "id");
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.locale = locale;
        this.timezone = timezone;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public void update(String name, String avatarUrl, String locale, String timezone) {
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.locale = locale;
        this.timezone = timezone;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getLocale() {
        return locale;
    }

    public String getTimezone() {
        return timezone;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
