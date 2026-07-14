package com.spanishai.backend.user.entity;

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
import java.time.LocalTime;
import java.util.Objects;
import java.util.UUID;

/**
 * `id` e sempre o mesmo UUID de profiles.id (relacao 1:1), atribuido explicitamente
 * por UserPreferencesService no provisionamento lazy -- mesmo raciocinio de Profile
 * (ver comentario la): Persistable evita que o Spring Data trate toda entidade como
 * existente so por causa do id nao-nulo, e chame merge() em vez de persist().
 */
@Entity
@Table(name = "user_preferences")
@EntityListeners(AuditingEntityListener.class)
public class UserPreferences implements Persistable<UUID> {

    @Id
    @Column(name = "profile_id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "font_size", nullable = false)
    private String fontSize;

    @Column(name = "sound_enabled", nullable = false)
    private boolean soundEnabled;

    @Column(name = "show_translation", nullable = false)
    private boolean showTranslation;

    @Column(name = "reminder_time")
    private LocalTime reminderTime;

    @Column(name = "notifications_enabled", nullable = false)
    private boolean notificationsEnabled;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected UserPreferences() {
        // JPA
    }

    public UserPreferences(UUID id, String fontSize, boolean soundEnabled, boolean showTranslation,
                            LocalTime reminderTime, boolean notificationsEnabled) {
        this.id = Objects.requireNonNull(id, "id");
        this.fontSize = fontSize;
        this.soundEnabled = soundEnabled;
        this.showTranslation = showTranslation;
        this.reminderTime = reminderTime;
        this.notificationsEnabled = notificationsEnabled;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public boolean isNew() {
        return createdAt == null;
    }

    public String getFontSize() {
        return fontSize;
    }

    public void setFontSize(String fontSize) {
        this.fontSize = fontSize;
    }

    public boolean isSoundEnabled() {
        return soundEnabled;
    }

    public void setSoundEnabled(boolean soundEnabled) {
        this.soundEnabled = soundEnabled;
    }

    public boolean isShowTranslation() {
        return showTranslation;
    }

    public void setShowTranslation(boolean showTranslation) {
        this.showTranslation = showTranslation;
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
