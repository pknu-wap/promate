package org.example.promate.global.jwt;

public record JwtTokenDto (String accessToken,
                         String refreshToken) {
}
