package org.example.promate.domain.project.dto;

import lombok.Builder;
import lombok.Getter;
import org.example.promate.domain.project.enums.ProjectStatus;

import java.time.LocalDate;

@Getter
@Builder
public class MyProjectResponseDTO {

    private Long projectId;
    private String title;
    private ProjectStatus projectStatus;
    private LocalDate startDate;
    private LocalDate endDate;
    private int completedTaskCount;
    private int incompleteTaskCount;
}