package com.spanishai.backend.infrastructure.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.core.env.Environment;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Nao usa @SpringBootTest de proposito: um contexto completo no perfil "supabase"
 * criaria um DataSource/HikariCP real, que tenta conectar de verdade no Postgres
 * assim que o bean e construido (falharia/travaria sem uma instancia real acessivel).
 * O ApplicationContextRunner aqui so processa application.properties +
 * application-supabase.properties e resolve os placeholders -- sem nenhum bean de
 * infraestrutura sendo criado -- provando que a configuracao do perfil esta correta
 * com credenciais fake, sem depender de um Supabase real.
 */
class SupabaseProfileConfigurationTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withInitializer(new ConfigDataApplicationContextInitializer())
            .withPropertyValues(
                    "spring.profiles.active=supabase",
                    "SUPABASE_DB_URL=jdbc:postgresql://localhost:5432/fake_test_db",
                    "SUPABASE_DB_USERNAME=fake_user",
                    "SUPABASE_DB_PASSWORD=fake_password"
            );

    @Test
    void supabaseProfileResolvesConfigurationWithFakeCredentials() {
        contextRunner.run(context -> {
            assertThat(context).hasNotFailed();

            Environment env = context.getEnvironment();
            assertThat(env.getActiveProfiles()).contains("supabase");
            assertThat(env.getProperty("spring.datasource.url"))
                    .isEqualTo("jdbc:postgresql://localhost:5432/fake_test_db");
            assertThat(env.getProperty("spring.datasource.username")).isEqualTo("fake_user");
            assertThat(env.getProperty("spring.datasource.password")).isEqualTo("fake_password");
            assertThat(env.getProperty("spring.datasource.driver-class-name"))
                    .isEqualTo("org.postgresql.Driver");
            assertThat(env.getProperty("spring.jpa.database-platform"))
                    .isEqualTo("org.hibernate.dialect.PostgreSQLDialect");
            assertThat(env.getProperty("spring.h2.console.enabled")).isEqualTo("false");
        });
    }
}
