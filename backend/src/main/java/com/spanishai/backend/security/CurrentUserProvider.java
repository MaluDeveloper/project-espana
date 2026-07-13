package com.spanishai.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * O claim `sub` do JWT do Supabase e o mesmo UUID de auth.users.id, que por sua
 * vez e a chave primaria de `profiles` (ver BACKEND_ARCHITECTURE.md, secao 3.1).
 */
@Component
public class CurrentUserProvider {

    public UUID getCurrentProfileId() {
        return UUID.fromString(getCurrentJwt().getSubject());
    }

    public Jwt getCurrentJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken jwtAuth)) {
            throw new IllegalStateException("Nenhum JWT autenticado no contexto de seguranca");
        }
        return jwtAuth.getToken();
    }

    public Optional<String> getCurrentEmail() {
        return Optional.ofNullable(getCurrentJwt().getClaimAsString("email"));
    }

    /**
     * Claim `user_metadata` do Supabase: populado tanto no cadastro por e-mail quanto
     * no login via Google (nome/avatar do provider OAuth) -- usado pelo ProfileService
     * como origem dos valores default no provisionamento lazy.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getCurrentUserMetadata() {
        Object claim = getCurrentJwt().getClaim("user_metadata");
        return claim instanceof Map<?, ?> map ? (Map<String, Object>) map : Map.of();
    }
}