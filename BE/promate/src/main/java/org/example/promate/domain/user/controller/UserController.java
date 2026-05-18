package org.example.promate.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.user.dto.UserProfileUpdateRequestDTO;
import org.example.promate.domain.user.dto.UserResponseDTO;
import org.example.promate.domain.user.service.UserService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.GeneralSuccessCode;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

}