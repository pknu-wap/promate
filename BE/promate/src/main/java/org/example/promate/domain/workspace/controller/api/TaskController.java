package org.example.promate.domain.workspace.controller.api;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.workspace.code.TaskSuccessCode;
import org.example.promate.domain.workspace.controller.docs.TaskControllerDocs;
import org.example.promate.domain.workspace.dto.req.TaskReqDto;
import org.example.promate.domain.workspace.dto.res.TaskResDto;
import org.example.promate.domain.workspace.service.command.TaskCommandService;
import org.example.promate.domain.workspace.service.query.TaskQueryService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects/{projectId}/tasks")
public class TaskController implements TaskControllerDocs {
    private final TaskQueryService taskQueryService;
    private final TaskCommandService taskCommandService;

    // 프로젝트 내 모든 태스크 조회
    @GetMapping()
    public ApiResponse<TaskResDto.TaskPreviewInfoListDto> getTaskPreviewList(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId
    ) {
        return ApiResponse.onSuccess(TaskSuccessCode.TASK_GET_SUCCESS, taskQueryService.getTaskPreviewList(userId, projectId));
    }

    // 특정 태스크 조회
    @GetMapping("/{taskId}")
    public ApiResponse<TaskResDto.TaskInfoDto> getTask(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long taskId
    ) {
        return ApiResponse.onSuccess(TaskSuccessCode.TASK_GET_SUCCESS, taskQueryService.getTask(userId, projectId, taskId));
    }

    @PostMapping()
    public ApiResponse<TaskResDto.TaskInfoDto> addTask(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody TaskReqDto.AddTaskDto dto
    ) {
        return ApiResponse.onSuccess(TaskSuccessCode.CREATED, taskCommandService.addTask(userId, projectId, dto));
    }

    @PutMapping("/{taskId}")
    public ApiResponse<TaskResDto.ModifiedTaskInfoDto> modifyTask(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskReqDto.ModifyTaskDto dto
    ) {
        return ApiResponse.onSuccess(TaskSuccessCode.TASK_MODIFY_SUCCESS, taskCommandService.modifyTask(userId, projectId, taskId, dto));
    }

    // 태스크 상태 변경
    @PatchMapping("/{taskId}/status")
    public ApiResponse<TaskResDto.UpdatedStatusTaskInfoDto> updateTaskStatus(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskReqDto.UpdateTaskStatusDto dto
    ) {
        return ApiResponse.onSuccess(TaskSuccessCode.TASK_STATUS_UPDATE_SUCCESS, taskCommandService.updateTaskStatus(userId, projectId, taskId, dto));
    }

    // 태스크 삭제
    @DeleteMapping("/{taskId}")
    public ApiResponse<TaskResDto.DeletedTaskInfoDto> deleteTask(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long taskId
    ) {
        return ApiResponse.onSuccess(TaskSuccessCode.TASK_DELETE_SUCCESS, taskCommandService.deleteTask(userId, projectId, taskId));
    }
}
