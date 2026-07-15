package com.spanishai.backend.adapter.out.persistence.user;

import com.spanishai.backend.adapter.out.persistence.entity.UserPreferencesJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserPreferencesJpaRepository extends JpaRepository<UserPreferencesJpaEntity, UUID> {
}
