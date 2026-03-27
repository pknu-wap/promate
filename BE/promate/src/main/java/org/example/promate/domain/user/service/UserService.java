package org.example.promate.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.user.dto.UserProfileUpdateRequestDTO;
import org.example.promate.domain.user.dto.UserResponseDTO;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponseDTO getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다."));

        return UserResponseDTO.from(user);
    }
}