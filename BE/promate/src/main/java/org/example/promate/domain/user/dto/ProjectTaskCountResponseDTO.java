package org.example.promate.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectTaskCountResponseDTO {
    private Long projectId;
    private String projectTitle;
    private int completedTaskCount;
    private int incompleteTaskCount;
}