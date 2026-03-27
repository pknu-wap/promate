package org.example.promate.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.user.dto.UserProfileUpdateRequestDTO;
import org.example.promate.domain.user.dto.UserResponseDTO;
import org.example.promate.domain.user.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public UserResponseDTO getUser(@PathVariable Long userId) {
        return userService.getUser(userId);
    }
}