package org.example.promate.domain.project.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyProjectResponseDTO {

    private Long projectId;
    private String title;
}