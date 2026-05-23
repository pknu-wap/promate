package org.example.promate.domain.apply.dto;

import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.user.entity.UserProjectHistory;

public record PastProjectDto(
        Long projectId,
        String title,
        String description,
        boolean isManual
) {

    public static PastProjectDto fromSystem(Project project) {
        return new PastProjectDto(project.getId(), project.getTitle(), project.getDescription(), false);
    }

    public static PastProjectDto fromManual(UserProjectHistory history) {
        return new PastProjectDto(history.getId(), history.getProjectName(), history.getDescription(), true);
    }
}