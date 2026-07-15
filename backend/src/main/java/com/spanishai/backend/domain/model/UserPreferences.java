package com.spanishai.backend.domain.model;

import java.time.Instant;
import java.time.LocalTime;
import java.util.Objects;
import java.util.UUID;

/**
 * `id` e sempre o mesmo UUID de profiles.id (relacao 1:1), atribuido explicitamente
 * pelo UserPreferencesService no provisionamento lazy -- mesmo raciocinio de Profile.
 */
public class UserPreferences {

    private final UUID id;
    private String fontSize;
    private boolean soundEnabled;
    private boolean showTranslation;
    private LocalTime reminderTime;
    private boolean notificationsEnabled;
    private final Instant createdAt;
    private final Instant updatedAt;

    public UserPreferences(UUID id, String fontSize, boolean soundEnabled, boolean showTranslation,
                            LocalTime reminderTime, boolean notificationsEnabled) {
        this(id, fontSize, soundEnabled, showTranslation, reminderTime, notificationsEnabled, null, null);
    }

    public UserPreferences(UUID id, String fontSize, boolean soundEnabled, boolean showTranslation,
                            LocalTime reminderTime, boolean notificationsEnabled,
                            Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id, "id");
        this.fontSize = fontSize;
        this.soundEnabled = soundEnabled;
        this.showTranslation = showTranslation;
        this.reminderTime = reminderTime;
        this.notificationsEnabled = notificationsEnabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public void update(String fontSize, boolean soundEnabled, boolean showTranslation,
                        LocalTime reminderTime, boolean notificationsEnabled) {
        this.fontSize = fontSize;
        this.soundEnabled = soundEnabled;
        this.showTranslation = showTranslation;
        this.reminderTime = reminderTime;
        this.notificationsEnabled = notificationsEnabled;
    }

    public UUID getId() {
        return id;
    }

    public String getFontSize() {
        return fontSize;
    }

    public boolean isSoundEnabled() {
        return soundEnabled;
    }

    public boolean isShowTranslation() {
        return showTranslation;
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
