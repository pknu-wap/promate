package org.example.promate.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.user.dto.UserProfileUpdateRequestDTO;
import org.example.promate.domain.user.dto.UserProjectHistoryRequestDTO;
import org.example.promate.domain.user.dto.UserProjectHistoryResponseDTO;
import org.example.promate.domain.user.dto.UserResponseDTO;
import org.example.promate.domain.user.service.UserService;
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

}