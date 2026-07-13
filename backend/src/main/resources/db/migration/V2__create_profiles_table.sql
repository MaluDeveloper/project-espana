-- Fase 1: perfil do usuario, 1:1 com auth.users (schema gerenciado pelo Supabase).
--
-- `id` NAO tem default de geracao (sem gen_random_uuid()): e sempre o mesmo UUID de
-- auth.users.id (claim `sub` do JWT), atribuido explicitamente pelo backend no
-- provisionamento lazy (ProfileService), nunca gerado pelo Postgres.
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    avatar_url TEXT,
    locale TEXT NOT NULL,
    timezone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
