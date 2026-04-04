package org.example.promate.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class KakaoUserResponseDTO {
    
    @JsonProperty("id")
    private Long kakaoId;
}