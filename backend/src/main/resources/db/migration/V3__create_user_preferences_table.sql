-- Fase 1: preferencias do usuario, 1:1 com profiles.
--
-- `profile_id` NAO tem default de geracao: e sempre o mesmo UUID de profiles.id,
-- atribuido explicitamente pelo backend no provisionamento lazy (UserPreferencesService),
-- nunca gerado pelo Postgres -- mesmo raciocinio de profiles.id em relacao a auth.users.id.
CREATE TABLE user_preferences (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    font_size TEXT NOT NULL DEFAULT 'normal',
    sound_enabled BOOLEAN NOT NULL DEFAULT true,
    show_translation BOOLEAN NOT NULL DEFAULT true,
    reminder_time TIME,
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
