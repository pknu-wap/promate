package org.example.promate.domain.mypage.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyActivityResponseDTO {
    private Long projectId;
    private String title;
}