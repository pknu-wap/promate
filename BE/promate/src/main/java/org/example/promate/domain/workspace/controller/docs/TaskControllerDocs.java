package org.example.promate.domain.workspace.controller.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.promate.domain.workspace.dto.req.TaskReqDto;
import org.example.promate.domain.workspace.dto.res.TaskResDto;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.springframework.web.bind.annotation.*;

@Tag(name = "WORKSPACE_TASK", description = "WORKSPACE 도메인 내 태스크 API")
public interface TaskControllerDocs {

    // 프로젝트 내 모든 태스크 조회
    @Operation(
            summary = "TASK_01 프로젝트 내 모든 태스크 조회하기",
            operationId = "WORKSPACE_TASK_01",
            description = "프로젝트에 현재 할당된 모든 태스크를 조회합니다. 팀 워크스페이스 내 태스크 정보에 사용됩니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "태스크 조회 성공 (TASK_S001)",
                    content = @Content(schema = @Schema(implementation = TaskResDto.TaskPreviewInfoListDto.class))
            )
    })
    @GetMapping("/projects/{projectId}/tasks")
    ApiResponse<TaskResDto.TaskPreviewInfoListDto> getTaskPreviewList(
            @PathVariable Long projectId
    );

    // 특정 태스크 조회
    @Operation(
            summary = "TASK_02 특정 태스크 조회하기",
            operationId = "WORKSPACE_TASK_02",
            description = "특정 태스크를 조회합니다. 조회 후 수정, 삭제 등을 수행할 수 있습니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "태스크 조회 성공 (TASK_S001)",
                    content = @Content(schema = @Schema(implementation = TaskResDto.TaskInfoDto.class))
            )
    })
    @GetMapping("/projects/{projectId}/tasks/{taskId}")
    ApiResponse<TaskResDto.TaskInfoDto> getTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId
    );

    // 태스크 추가
    @Operation(
            summary = "TASK_03 태스크 추가하기",
            operationId = "WORKSPACE_TASK_03",
            description = "태스크를 추가합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "태스크 추가 성공 (TASK_S002)",
                    content = @Content(schema = @Schema(implementation = TaskResDto.TaskInfoDto.class))
            )
    })
    @PostMapping("/projects/{projectId}/tasks")
    ApiResponse<TaskResDto.TaskInfoDto> addTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskReqDto.AddTaskDto dto
    );

    // 태스크 수정
    @Operation(
            summary = "TASK_04 태스크 수정하기",
            operationId = "WORKSPACE_TASK_04",
            description = "태스크를 수정합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "태스크 수정 성공 (TASK_S003)",
                    content = @Content(schema = @Schema(implementation = TaskResDto.ModifiedTaskInfoDto.class))
            )
    })
    @PutMapping("/projects/{projectId}/tasks/{taskId}")
    ApiResponse<TaskResDto.ModifiedTaskInfoDto> modifyTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskReqDto.ModifyTaskDto dto
    );

    // 태스크 상태 변경
    @Operation(
            summary = "TASK_05 태스크 상태 변경하기",
            operationId = "WORKSPACE_TASK_05",
            description = "태스크의 상태를 변경합니다(TODO, IN_PROGRESS, DONE)"
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "태스크 상태 변경 성공 (TASK_S004)",
                    content = @Content(schema = @Schema(implementation = TaskResDto.UpdatedStatusTaskInfoDto.class))
            )
    })
    @PatchMapping("/projects/{projectId}/tasks/{taskId}/status")
    ApiResponse<TaskResDto.UpdatedStatusTaskInfoDto> updateTaskStatus(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskReqDto.UpdateTaskStatusDto dto
    );

    // 태스크 삭제
    @Operation(
            summary = "TASK_06 태스크 삭제하기",
            operationId = "WORKSPACE_TASK_06",
            description = "태스크를 삭제합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "태스크 삭제 성공 (TASK_S005)",
                    content = @Content(schema = @Schema(implementation = TaskResDto.DeletedTaskInfoDto.class))
            )
    })
    @DeleteMapping("/projects/{projectId}/tasks/{taskId}")
    ApiResponse<TaskResDto.DeletedTaskInfoDto> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId
    );
}