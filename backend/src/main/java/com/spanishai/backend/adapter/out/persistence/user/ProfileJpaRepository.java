package com.spanishai.backend.adapter.out.persistence.user;

import com.spanishai.backend.adapter.out.persistence.entity.ProfileJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProfileJpaRepository extends JpaRepository<ProfileJpaEntity, UUID> {
}
