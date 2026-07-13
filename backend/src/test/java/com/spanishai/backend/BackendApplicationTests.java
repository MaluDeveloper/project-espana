package com.spanishai.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Sobe o contexto completo no perfil "local" (H2) -- se qualquer bean da Fase 0
 * (security, Flyway, JPA auditing, OpenAPI) estiver mal configurado, falha aqui.
 */
@SpringBootTest
@ActiveProfiles("local")
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}
