package com.spanishai.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Testes de ponta a ponta (servidor real em porta aleatoria) da cadeia de
 * seguranca configurada em SecurityConfig/SupabaseJwtDecoderConfig.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("local")
class Phase0EndpointTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void healthEndpointIsPublicAndReturnsOk() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/health", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("\"status\":\"ok\"");
    }

    @Test
    void unauthenticatedRequestToProtectedPathReturns401() {
        // A rota nao precisa existir: o filtro de autorizacao do OAuth2 Resource
        // Server intercepta e barra a requisicao antes dela chegar ao dispatcher
        // do Spring MVC -- por isso o resultado e 401, nunca 404.
        ResponseEntity<String> response = restTemplate.getForEntity("/api/protected/ping", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void openApiDocsArePubliclyAvailableAndDescribeBearerAuth() {
        ResponseEntity<String> response = restTemplate.getForEntity("/v3/api-docs", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("\"openapi\"");
        assertThat(response.getBody()).contains("supabaseJwt");
    }
}