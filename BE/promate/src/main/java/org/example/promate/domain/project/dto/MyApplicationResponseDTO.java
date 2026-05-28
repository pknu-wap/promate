package org.example.promate.domain.project.dto;

import lombok.Builder;
import lombok.Getter;
import org.example.promate.domain.apply.enums.Status;

import java.time.LocalDateTime;

@Getter
@Builder
public class MyApplicationResponseDTO {
    private Long applicationId;
    private Long recruitmentId;
    private String title;
    private Status status;
    private LocalDateTime createdAt;
    private String description; // 프로젝트 설명
    private Integer recruitCount; // 모집인원 반환
}