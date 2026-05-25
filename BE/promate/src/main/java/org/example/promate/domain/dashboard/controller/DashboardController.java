package org.example.promate.domain.dashboard.controller;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.dashboard.code.DashboardSuccessCode;
import org.example.promate.domain.dashboard.dto.DashboardResponseDTO;
import org.example.promate.domain.dashboard.service.DashboardService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/projects/me")
    public ApiResponse<List<DashboardResponseDTO.MyProjectDTO>> getMyProjects(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                DashboardSuccessCode.GET_ACTIVE_PROJECTS_SUCCESS,
                dashboardService.getMyProjects(userId)
        );
    }

    @GetMapping("/tasks/deadline")
    public ApiResponse<List<DashboardResponseDTO.TaskDTO>> getDeadlineTasks(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                DashboardSuccessCode.GET_DEADLINE_TASKS_SUCCESS,
                dashboardService.getDeadlineTasks(userId)
        );
    }

    @GetMapping("/tasks/completed")
    public ApiResponse<List<DashboardResponseDTO.TaskDTO>> getCompletedTasks(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                DashboardSuccessCode.GET_COMPLETED_TASKS_SUCCESS,
                dashboardService.getCompletedTasks(userId)
        );
    }

    @GetMapping("/calendar")
    public ApiResponse<List<DashboardResponseDTO.CalendarDTO>> getCalendar(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                DashboardSuccessCode.GET_CALENDAR_SUCCESS,
                dashboardService.getCalendar(userId)
        );
    }

    @GetMapping("/projects/status")
    public ApiResponse<List<DashboardResponseDTO.ProjectStatusDTO>> getProjectStatus(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                DashboardSuccessCode.GET_PROJECT_STATUS_SUCCESS,
                dashboardService.getProjectStatus(userId)
        );
    }
}