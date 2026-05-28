package org.example.promate.domain.project.controller;

import lombok.RequiredArgsConstructor;

import org.example.promate.domain.project.code.ProjectSuccessCode;
import org.example.promate.domain.project.dto.MyActivityResponseDTO;
import org.example.promate.domain.project.dto.MyApplicationResponseDTO;
import org.example.promate.domain.project.dto.MyProjectResponseDTO;
import org.example.promate.domain.project.dto.ProjectMemberResponseDTO;
import org.example.promate.domain.project.service.ProjectService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/me")
    public ApiResponse<List<MyProjectResponseDTO>> getMyProjects(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                ProjectSuccessCode.MY_PROJECTS_FOUND,
                projectService.getMyProjects(userId)
        );
    }

    @GetMapping("/applications/me")
    public ApiResponse<List<MyApplicationResponseDTO>> getMyApplications(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                ProjectSuccessCode.MY_APPLICATIONS_FOUND,
                projectService.getMyApplications(userId)
        );
    }

    @GetMapping("/activity/me")
    public ApiResponse<List<MyActivityResponseDTO>> getMyActivities(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                ProjectSuccessCode.MY_ACTIVITIES_FOUND,
                projectService.getMyActivities(userId)
        );
    }

    @GetMapping("/{projectId}/members")
    public ApiResponse<List<ProjectMemberResponseDTO>> getProjectMembers(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId
    ) {
        return ApiResponse.onSuccess(
                ProjectSuccessCode.PROJECT_MEMBER_FOUND,
                projectService.getProjectMembers(userId, projectId)
        );
    }



}