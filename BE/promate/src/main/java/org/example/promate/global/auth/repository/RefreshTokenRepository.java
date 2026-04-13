package org.example.promate.global.auth.repository;

import org.example.promate.global.auth.entity.RefreshToken;
import org.example.promate.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByUser(User user);
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
    void deleteByUser(User user);
}