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
    public UserResponseDTO getMyInfo(@AuthenticationPrincipal Long userId) {
        return userService.getUser(userId);
    }

    @PatchMapping("/me")
    public UserResponseDTO updateMyInfo(
            @AuthenticationPrincipal Long userId,
            @RequestBody UserProfileUpdateRequestDTO request
    ) {
        return userService.updateUserProfile(userId, request);
    }

    @GetMapping("/me/projectHistories")
    public List<UserProjectHistoryResponseDTO> getMyProjectHistories(
            @AuthenticationPrincipal Long userId
    ) {
        return userService.getMyProjectHistories(userId);
    }

    @PostMapping("/me/projectHistories")
    public UserProjectHistoryResponseDTO createProjectHistory(
            @AuthenticationPrincipal Long userId,
            @RequestBody UserProjectHistoryRequestDTO request
    ) {
        return userService.createProjectHistory(userId, request);
    }

    @PatchMapping("/me/projectHistories/{historyId}")
    public UserProjectHistoryResponseDTO updateProjectHistory(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long historyId,
            @RequestBody UserProjectHistoryRequestDTO request
    ) {
        return userService.updateProjectHistory(userId, historyId, request);
    }

    @DeleteMapping("/me/projectHistories/{historyId}")
    public void deleteProjectHistory(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long historyId
    ) {
        userService.deleteProjectHistory(userId, historyId);
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