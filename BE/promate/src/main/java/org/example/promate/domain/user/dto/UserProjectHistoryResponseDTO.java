package org.example.promate.domain.user.dto;

import lombok.Builder;
import lombok.Getter;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.example.promate.domain.user.entity.UserProjectHistory;

import java.time.LocalDate;

@Getter
@Builder
public class UserProjectHistoryResponseDTO {

    private Long historyId;
    private String projectName;
    private String role;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private ProjectStatus status;
    private Boolean editable;

    public static UserProjectHistoryResponseDTO from(UserProjectHistory history) {
        return UserProjectHistoryResponseDTO.builder()
                .historyId(history.getId())
                .projectName(history.getProjectName())
                .role(history.getRole())
                .startDate(history.getStartDate())
                .endDate(history.getEndDate())
                .description(history.getDescription())
                .status(calculateStatus(history.getStartDate(), history.getEndDate()))
                .editable(true)
                .build();
    }

    private static ProjectStatus calculateStatus(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();

        if (startDate != null && startDate.isAfter(today)) {
            return ProjectStatus.PREPARING;
        }

        if (endDate != null && endDate.isBefore(today)) {
            return ProjectStatus.COMPLETED;
        }

        return ProjectStatus.ACTIVE;
    }
}