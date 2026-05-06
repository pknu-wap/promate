package org.example.promate.domain.project.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyActivityResponseDTO {
    private Long projectId;
    private String title;
}