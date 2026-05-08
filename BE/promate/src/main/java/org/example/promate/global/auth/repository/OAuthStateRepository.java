package org.example.promate.global.auth.repository;

import org.example.promate.global.auth.entity.OAuthState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface OAuthStateRepository extends JpaRepository<OAuthState, String> {
    void deleteByExpiredAtBefore(LocalDateTime now);
}