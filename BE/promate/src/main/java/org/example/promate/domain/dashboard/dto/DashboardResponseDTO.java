package org.example.promate.domain.dashboard.dto;

import lombok.Builder;
import lombok.Getter;
import org.example.promate.domain.workspace.enums.TaskStatus;

import java.time.LocalDate;

public class DashboardResponseDTO {

    @Getter
    @Builder
    public static class MyProjectDTO {
        private Long projectId;
        private String title;
        private LocalDate endDate;
        private String dueStatus; // 프로젝트 마감일 기준 상태(임박, 여유)
    }

    @Getter
    @Builder
    public static class TaskDTO {
        private Long taskId;
        private Long projectId;
        private String projectTitle;
        private String title;
        private LocalDate dueDate;
        private TaskStatus taskStatus;
    }

    @Getter
    @Builder
    public static class CalendarDTO {
        private Long scheduleId;
        private Long projectId;
        private String projectTitle;
        private String title;
        private String content;
        private LocalDate startAt;
        private LocalDate endAt;
    }

    @Getter
    @Builder
    public static class ProjectStatusDTO {
        private Long projectId;
        private String title;
        private LocalDate endDate;
        private String dueStatus; // 프로젝트 마감일 기준 상태(임박, 여유)
        private Long completedTaskCount;
        private Long totalTaskCount;
        private Integer progressRate;
    }
}
