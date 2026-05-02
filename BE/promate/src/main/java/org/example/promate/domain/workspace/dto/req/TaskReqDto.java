package org.example.promate.domain.workspace.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.domain.workspace.enums.TaskStatus;

import java.time.LocalDate;

public class TaskReqDto {

    @Getter
    @AllArgsConstructor
    public static class AddTaskDto {
        @NotNull(message = "담당 팀원은 필수입니다. 한 명을 필수로 선택해 주세요.")
        Long managerId; //담당 팀원 ID, 팀원 목록 중 선택

        @NotBlank(message = "제목은 필수로 작성해야 합니다.")
        String title;
        String description;

        @NotNull(message = "마감일은 필수입니다.")
        LocalDate dueDate;
    }

    @Getter
    @AllArgsConstructor
    public static class ModifyTaskDto {
        @NotNull(message = "담당 팀원은 필수입니다. 한 명을 필수로 선택해 주세요.")
        Long managerId; //담당 팀원 ID, 팀원 목록 중 선택

        @NotBlank(message = "제목은 필수로 작성해야 합니다.")
        String title;
        String description;

        @NotNull(message = "마감일은 필수입니다.")
        LocalDate dueDate;
    }

    @Getter
    @AllArgsConstructor
    public static class UpdateTaskStatusDto {
        @NotNull(message = "상태 변경 시 상태 값은 필수로 선택해야 합니다.")
        @Schema(allowableValues = {"TODO", "IN_PROGRESS", "DONE"})
        TaskStatus status;
    }
}
