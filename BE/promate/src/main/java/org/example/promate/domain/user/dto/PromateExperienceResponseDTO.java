package org.example.promate.domain.user.dto;

import lombok.Builder;
import lombok.Getter;
import org.example.promate.domain.project.enums.ProjectStatus;

import java.time.LocalDate;

@Getter
@Builder
public class PromateExperienceResponseDTO {
    private Long projectId;
    private String projectTitle;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus projectStatus;
    private Double peerEvaluationScore;
}