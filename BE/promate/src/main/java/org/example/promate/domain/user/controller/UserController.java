package org.example.promate.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.user.dto.UserProfileUpdateRequestDTO;
import org.example.promate.domain.user.dto.UserResponseDTO;
import org.example.promate.domain.user.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

}