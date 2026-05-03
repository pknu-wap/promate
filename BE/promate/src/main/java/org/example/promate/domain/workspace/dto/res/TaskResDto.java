package org.example.promate.domain.workspace.dto.res;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;
import org.example.promate.domain.workspace.enums.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class TaskResDto {
    @Builder
    @Getter
    @JsonPropertyOrder({"taskId", "title", "status", "dueDate"})
    public static class TaskPreviewInfoDto{
        Long taskId;
        String title;
        TaskStatus status;
        LocalDate dueDate;
    }

    @Builder
    @Getter
    @JsonPropertyOrder({"size", "projectProgress", "taskList"})
    public static class TaskPreviewInfoListDto{
        int size;
        double projectProgress;
        List<TaskPreviewInfoDto> taskList;
    }

    @Builder
    @Getter
    @JsonPropertyOrder({"taskId", "role", "managerName", "title", "description", "status", "dueDate", "createdAt"})
    public static class TaskInfoDto{
        Long taskId;
        String role;    //담당 member의 역할
        String managerName; //담당 member Name
        String title;
        String description;
        TaskStatus status;
        LocalDate dueDate;
        LocalDateTime createdAt;
    }

    @Builder
    @Getter
    @JsonPropertyOrder({"taskId", "status", "updatedAt"})
    public static class ModifiedTaskInfoDto{
        Long taskId;
        TaskStatus status;
        LocalDateTime updatedAt;
    }

    @Builder
    @Getter
    @JsonPropertyOrder({"taskId", "status", "updatedAt", "projectProgress", "isProjectCompleted"})
    public static class UpdatedStatusTaskInfoDto{
        Long taskId;
        TaskStatus status;
        LocalDateTime updatedAt;
        double projectProgress;
        boolean isProjectCompleted;
    }

    @Builder
    @Getter
    @JsonPropertyOrder({"taskId", "deletedAt"})
    public static class DeletedTaskInfoDto{
        Long taskId;
        LocalDateTime deletedAt;
    }
}