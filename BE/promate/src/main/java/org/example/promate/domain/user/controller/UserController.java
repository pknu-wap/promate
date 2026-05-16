package org.example.promate.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.user.dto.*;
import org.example.promate.domain.user.service.UserService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.GeneralSuccessCode;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponseDTO> getMyInfo(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                userService.getUser(userId)
        );
    }

    @PatchMapping("/me")
    public ApiResponse<UserResponseDTO> updateMyInfo(
            @AuthenticationPrincipal Long userId,
            @RequestBody UserProfileUpdateRequestDTO request
    ) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                userService.updateUserProfile(userId, request)
        );
    }

    @GetMapping("/me/projectHistories")
    public ApiResponse<List<UserProjectHistoryResponseDTO>> getMyProjectHistories(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                userService.getMyProjectHistories(userId)
        );
    }

    @PostMapping("/me/projectHistories")
    public ApiResponse<UserProjectHistoryResponseDTO> createProjectHistory(
            @AuthenticationPrincipal Long userId,
            @RequestBody UserProjectHistoryRequestDTO request
    ) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                userService.createProjectHistory(userId, request)
        );
    }

    @PatchMapping("/me/projectHistories/{historyId}")
    public ApiResponse<UserProjectHistoryResponseDTO> updateProjectHistory(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long historyId,
            @RequestBody UserProjectHistoryRequestDTO request
    ) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                userService.updateProjectHistory(userId, historyId, request)
        );
    }

    @DeleteMapping("/me/projectHistories/{historyId}")
    public ApiResponse<Void> deleteProjectHistory(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long historyId
    ) {
        userService.deleteProjectHistory(userId, historyId);

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                null
        );
    }

    @GetMapping("/me/projects/task-counts")
    public ApiResponse<List<ProjectTaskCountResponseDTO>> getProjectTaskCounts(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                userService.getProjectTaskCounts(userId)
        );
    }
}
