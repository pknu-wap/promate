package org.example.promate.domain.workspace.controller.api;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.workspace.code.ScheduleSuccessCode;
import org.example.promate.domain.workspace.controller.docs.ScheduleControllerDocs;
import org.example.promate.domain.workspace.dto.req.ScheduleReqDto;
import org.example.promate.domain.workspace.dto.res.ScheduleResDto;
import org.example.promate.domain.workspace.service.command.ScheduleCommandService;
import org.example.promate.domain.workspace.service.query.ScheduleQueryService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.security.CustomPrincipal;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects/{projectId}/schedules")
public class ScheduleController implements ScheduleControllerDocs {
    private final ScheduleCommandService scheduleCommandService;
    private final ScheduleQueryService scheduleQueryService;

    // TODO: 인증 로직 통합 후 제거
    private final Long userId = 1L;

    // 팀 일정 추가하기(캘린더 UI)
    @PostMapping()
    public ApiResponse<ScheduleResDto.AddedScheduleInfoDto> addSchedule(
//            @AuthenticationPrincipal CustomPrincipal customPrincipal,
            @PathVariable Long projectId,
            @Valid @RequestBody ScheduleReqDto.AddScheduleDto dto
    ){
//        return ApiResponse.onSuccess(ScheduleSuccessCode.CREATED, scheduleCommandService.addSchedule(customPrincipal.getUserId(), projectId, dto));
        return ApiResponse.onSuccess(ScheduleSuccessCode.CREATED, scheduleCommandService.addSchedule(userId, projectId, dto));

    }

    // 팀 일정 조회하기
    @GetMapping()
    public ApiResponse<ScheduleResDto.MonthlyScheduleListInfoDto> getMonthlySchedules(
//            @AuthenticationPrincipal CustomPrincipal customPrincipal,
            @PathVariable Long projectId,
            @RequestParam(name="year") Integer year,
            @RequestParam(name="month") Integer month

    ){
//        return ApiResponse.onSuccess(ScheduleSuccessCode.OK, scheduleQueryService.getMonthlySchedules(customPrincipal.getUserId(), projectId, year, month));
        return ApiResponse.onSuccess(ScheduleSuccessCode.OK, scheduleQueryService.getMonthlySchedules(userId, projectId, year, month));
    }

    // 팀 일정 상세 조회하기
    @GetMapping("{scheduleId}")
    public ApiResponse<ScheduleResDto.ProjectScheduleDetailInfoDto> getScheduleDetails(
//            @AuthenticationPrincipal CustomPrincipal customPrincipal,
            @PathVariable Long projectId,
            @PathVariable Long scheduleId
    ){
//        return ApiResponse.onSuccess(ScheduleSuccessCode.DETAILS_OK, scheduleQueryService.getScheduleDetails(customPrincipal.getUserId(), projectId, scheduleId));
        return ApiResponse.onSuccess(ScheduleSuccessCode.DETAILS_OK, scheduleQueryService.getScheduleDetails(userId, projectId, scheduleId));
    }

    // 팀 일정 수정하기
    @PutMapping("/{scheduleId}")
    public ApiResponse<ScheduleResDto.ModifiedScheduleInfoDto> modifySchedule(
//            @AuthenticationPrincipal CustomPrincipal customPrincipal,
            @PathVariable Long projectId,
            @PathVariable Long scheduleId,
            @Valid @RequestBody ScheduleReqDto.ModifyScheduleDto dto
    ){
//        return ApiResponse.onSuccess(ScheduleSuccessCode.MODIFY_SUCCESS, scheduleCommandService.modifySchedule(customPrincipal.getUserId(), projectId, scheduleId, dto));
        return ApiResponse.onSuccess(ScheduleSuccessCode.MODIFY_SUCCESS, scheduleCommandService.modifySchedule(userId, projectId, scheduleId, dto));
    }

    // 팀 일정 삭제하기
    @DeleteMapping("/{scheduleId}")
    public ApiResponse<ScheduleResDto.DeletedScheduleInfoDto> modifySchedule(
//            @AuthenticationPrincipal CustomPrincipal customPrincipal,
            @PathVariable Long projectId,
            @PathVariable Long scheduleId
    ){
//        return ApiResponse.onSuccess(ScheduleSuccessCode.DELETE_SUCCESS, scheduleCommandService.deleteSchedule(customPrincipal.getUserId(), projectId, scheduleId));
        return ApiResponse.onSuccess(ScheduleSuccessCode.DELETE_SUCCESS, scheduleCommandService.deleteSchedule(userId, projectId, scheduleId));
    }
}
