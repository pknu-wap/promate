package org.example.promate.domain.auth.repository;

import org.example.promate.domain.auth.entity.RefreshToken;
import org.example.promate.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByUser(User user);
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
    void deleteByUser(User user);
}