package com.spanishai.backend;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.flywaydb.core.api.MigrationState;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("local")
class FlywayMigrationTests {

    @Autowired
    private Flyway flyway;

    @Test
    void baselineMigrationIsAppliedSuccessfully() {
        MigrationInfo baseline = flyway.info().applied()[0];

        assertThat(baseline.getVersion().toString()).isEqualTo("1");
        assertThat(baseline.getDescription()).isEqualTo("baseline");
        assertThat(baseline.getState()).isEqualTo(MigrationState.SUCCESS);
    }

    @Test
    void allMigrationsUpToAndIncludingProfilesAreAppliedWithNothingPending() {
        MigrationInfo current = flyway.info().current();

        assertThat(current).isNotNull();
        assertThat(current.getVersion().toString()).isEqualTo("2");
        assertThat(current.getDescription()).isEqualTo("create profiles table");
        assertThat(current.getState()).isEqualTo(MigrationState.SUCCESS);
        assertThat(flyway.info().pending()).isEmpty();
    }
}