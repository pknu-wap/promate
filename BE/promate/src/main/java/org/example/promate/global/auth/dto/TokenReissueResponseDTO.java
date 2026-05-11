package org.example.promate.global.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TokenReissueResponseDTO {
    private String accessToken;
    private String refreshToken;
}