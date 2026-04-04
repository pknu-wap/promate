package org.example.promate.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.user.dto.UserProfileUpdateRequestDTO;
import org.example.promate.domain.user.dto.UserResponseDTO;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.exception.UserErrorCode;
import org.example.promate.domain.user.exception.UserException;
import org.example.promate.domain.user.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponseDTO getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        return UserResponseDTO.from(user);
    }

    @Transactional
    public UserResponseDTO updateUserProfile(Long userId, UserProfileUpdateRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        user.updateProfile(
                request.getName(),
                request.getProfileImageUrl()
        );

        return UserResponseDTO.from(user);
    }


}