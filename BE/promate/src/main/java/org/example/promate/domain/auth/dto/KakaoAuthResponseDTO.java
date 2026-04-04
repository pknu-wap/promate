package org.example.promate.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoAuthResponseDTO {
    private Long id; // DB PK
    private boolean isProfileCompleted; // 추가 정보 입력 완료 여부
    private String accessToken;
    private String refreshToken;
}