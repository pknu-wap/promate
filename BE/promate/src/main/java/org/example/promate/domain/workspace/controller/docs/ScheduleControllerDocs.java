package org.example.promate.domain.workspace.controller.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.promate.domain.workspace.dto.req.ScheduleReqDto;
import org.example.promate.domain.workspace.dto.res.ScheduleResDto;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@Tag(name = "WORKSPACE_SCHEDULE", description = "WORKSPACE 도메인 내 팀 일정 관리 API")
public interface ScheduleControllerDocs {

    // 팀 일정 추가하기(캘린더 UI)
    @Operation(
            summary = "SCHEDULE_01 팀 일정 추가하기",
            operationId = "WORKSPACE_SCHEDULE_01",
            description = "캘린더 UI에 활용될 팀 일정을 추가합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "일정 추가 성공 (SCHEDULE_S001)",
                    content = @Content(schema = @Schema(implementation = ScheduleResDto.AddedScheduleInfoDto.class))
            )
    })
    @PostMapping("/projects/{projectId}/schedules")
    ApiResponse<ScheduleResDto.AddedScheduleInfoDto> addSchedule(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody ScheduleReqDto.AddScheduleDto dto
    );

    // 팀 일정 조회하기
    @Operation(
            summary = "SCHEDULE_02 팀 일정 조회하기",
            operationId = "WORKSPACE_SCHEDULE_02",
            description = "캘린더 UI로 보여줄 팀 일정 목록을 조회합니다."

    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "일정 조회 성공 (SCHEDULE_S002)",
                    content = @Content(schema = @Schema(implementation = ScheduleResDto.MonthlyScheduleListInfoDto.class))
            )
    })
    @GetMapping("/projects/{projectId}/schedules")
    ApiResponse<ScheduleResDto.MonthlyScheduleListInfoDto> getMonthlySchedules(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @RequestParam(name = "year") Integer year,
            @RequestParam(name = "month") Integer month

    );

    // 팀 일정 상세 조회하기
    @Operation(
            summary = "SCHEDULE_03 팀 일정 상세 조회하기",
            operationId = "WORKSPACE_SCHEDULE_03",
            description = "특정 팀 일정의 상세 정보를 조회합니다."

    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "일정 조회 성공 (SCHEDULE_S003)",
                    content = @Content(schema = @Schema(implementation = ScheduleResDto.ProjectScheduleDetailInfoDto.class))
            )
    })
    @GetMapping("/projects/{projectId}/schedules/{scheduleId}")
    ApiResponse<ScheduleResDto.ProjectScheduleDetailInfoDto> getScheduleDetails(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long scheduleId
    );

    // 팀 일정 수정하기
    @Operation(
            summary = "SCHEDULE_04 팀 일정 수정하기",
            operationId = "WORKSPACE_SCHEDULE_04",
            description = "팀 일정을 수정합니다."

    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "일정 수정 성공 (SCHEDULE_S004)",
                    content = @Content(schema = @Schema(implementation = ScheduleResDto.ModifiedScheduleInfoDto.class))
            )
    })
    @PutMapping("/projects/{projectId}/schedules/{scheduleId}")
    ApiResponse<ScheduleResDto.ModifiedScheduleInfoDto> modifySchedule(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long scheduleId,
            @Valid @RequestBody ScheduleReqDto.ModifyScheduleDto dto
    );

    // 팀 일정 삭제하기
    @Operation(
            summary = "SCHEDULE_05 팀 일정 삭제하기",
            operationId = "WORKSPACE_SCHEDULE_05",
            description = "팀 일정을 삭제합니다."

    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "일정 삭제 성공 (SCHEDULE_S005)",
                    content = @Content(schema = @Schema(implementation = ScheduleResDto.DeletedScheduleInfoDto.class))
            )
    })
    @DeleteMapping("/projects/{projectId}/schedules/{scheduleId}")
    ApiResponse<ScheduleResDto.DeletedScheduleInfoDto> deleteSchedule(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long scheduleId
    );
}