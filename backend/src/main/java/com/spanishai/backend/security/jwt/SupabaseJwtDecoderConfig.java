package com.spanishai.backend.security.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;

import java.util.List;

/**
 * O projeto Supabase assina os JWTs com uma chave assimetrica ECC (P-256 / ES256),
 * nao com um secret HS256 compartilhado. O decoder busca a chave publica correspondente
 * via JWKS e o Nimbus cuida do cache/rotacao automaticamente.
 */
@Configuration
public class SupabaseJwtDecoderConfig {

    @Value("${supabase.auth.jwks-uri}")
    private String jwksUri;

    @Value("${supabase.auth.issuer-uri}")
    private String issuerUri;

    @Bean
    public JwtDecoder jwtDecoder() {
        // withJwkSetUri(...) so aceita RS256 por padrao -- Supabase assina com ES256,
        // entao o algoritmo precisa ser declarado explicitamente ou a verificacao falha
        // com "Another algorithm expected, or no matching key(s) found".
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(jwksUri)
                .jwsAlgorithm(SignatureAlgorithm.ES256)
                .build();

        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<Jwt> withAudience = new JwtClaimValidator<List<String>>(
                "aud", aud -> aud != null && aud.contains("authenticated"));

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withIssuer, withAudience));
        return decoder;

    }
}