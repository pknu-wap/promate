package org.example.promate.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.user.code.UserSuccessCode;
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
                UserSuccessCode.GET_USER_SUCCESS,
                userService.getUser(userId)
        );
    }

    @PatchMapping("/me")
    public ApiResponse<UserResponseDTO> updateMyInfo(
            @AuthenticationPrincipal Long userId,
            @RequestBody UserProfileUpdateRequestDTO request
    ) {
        return ApiResponse.onSuccess(
                UserSuccessCode.UPDATE_USER_SUCCESS,
                userService.updateUserProfile(userId, request)
        );
    }

    @GetMapping("/me/projectHistories")
    public ApiResponse<List<UserProjectHistoryResponseDTO>> getMyProjectHistories(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                UserSuccessCode.GET_PROJECT_HISTORY_SUCCESS,
                userService.getMyProjectHistories(userId)
        );
    }

    @PostMapping("/me/projectHistories")
    public ApiResponse<UserProjectHistoryResponseDTO> createProjectHistory(
            @AuthenticationPrincipal Long userId,
            @RequestBody UserProjectHistoryRequestDTO request
    ) {
        return ApiResponse.onSuccess(
                UserSuccessCode.CREATE_PROJECT_HISTORY_SUCCESS,
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
                UserSuccessCode.UPDATE_PROJECT_HISTORY_SUCCESS,
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
                UserSuccessCode.DELETE_PROJECT_HISTORY_SUCCESS,
                null
        );
    }

    @GetMapping("/me/projects/task-counts")
    public ApiResponse<List<ProjectTaskCountResponseDTO>> getProjectTaskCounts(
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                UserSuccessCode.GET_PROJECT_TASK_COUNT_SUCCESS,
                userService.getProjectTaskCounts(userId)
        );
    }
}
