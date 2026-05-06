package org.example.promate.global.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenReissueResponseDTO {
    private String accessToken;
    private boolean profileCompleted;
}