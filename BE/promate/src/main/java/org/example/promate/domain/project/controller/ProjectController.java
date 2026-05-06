package org.example.promate.domain.project.controller;

import lombok.RequiredArgsConstructor;

import org.example.promate.domain.project.dto.MyActivityResponseDTO;
import org.example.promate.domain.project.dto.MyApplicationResponseDTO;
import org.example.promate.domain.project.dto.MyProjectResponseDTO;
import org.example.promate.domain.project.service.ProjectService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.GeneralSuccessCode;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/applications/me")
    public ApiResponse<List<MyApplicationResponseDTO>> getMyApplications(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                projectService.getMyApplications(userId)
        );
    }

    @GetMapping("/projects/me")
    public ApiResponse<List<MyProjectResponseDTO>> getMyProjects(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                projectService.getMyProjects(userId)
        );
    }

    @GetMapping("/activity/me")
    public ApiResponse<List<MyActivityResponseDTO>> getMyActivities(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                projectService.getMyActivities(userId)
        );
    }



}