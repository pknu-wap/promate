package org.example.promate.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.user.dto.UserProfileUpdateRequestDTO;
import org.example.promate.domain.user.dto.UserProjectHistoryRequestDTO;
import org.example.promate.domain.user.dto.UserProjectHistoryResponseDTO;
import org.example.promate.domain.user.dto.UserResponseDTO;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.entity.UserProjectHistory;
import org.example.promate.domain.user.exception.UserErrorCode;
import org.example.promate.domain.user.exception.UserException;
import org.example.promate.domain.user.repository.UserProjectHistoryRepository;
import org.example.promate.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
                request.getName()
        );

        return UserResponseDTO.from(user);
    }

    private final UserProjectHistoryRepository userProjectHistoryRepository;

    @Transactional(readOnly = true)
    public List<UserProjectHistoryResponseDTO> getMyProjectHistories(Long userId) {
        return userProjectHistoryRepository.findByUserId(userId)
                .stream()
                .map(UserProjectHistoryResponseDTO::from)
                .toList();
    }

    @Transactional
    public UserProjectHistoryResponseDTO createProjectHistory(
            Long userId,
            UserProjectHistoryRequestDTO request
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND)); // 커스텀에러 추후 추가 예정

        UserProjectHistory history = UserProjectHistory.builder()
                .user(user)
                .projectName(request.getProjectName())
                .role(request.getRole())
                .period(request.getPeriod())
                .description(request.getDescription())
                .build();

        UserProjectHistory savedHistory = userProjectHistoryRepository.save(history);

        return UserProjectHistoryResponseDTO.from(savedHistory);
    }

    @Transactional
    public UserProjectHistoryResponseDTO updateProjectHistory(
            Long userId,
            Long historyId,
            UserProjectHistoryRequestDTO request
    ) {
        UserProjectHistory history = userProjectHistoryRepository.findByIdAndUserId(historyId, userId)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND)); // 커스텀에러 추후 추가 예정

        history.update(
                request.getProjectName(),
                request.getRole(),
                request.getPeriod(),
                request.getDescription()
        );

        return UserProjectHistoryResponseDTO.from(history);
    }

    @Transactional
    public void deleteProjectHistory(Long userId, Long historyId) {
        UserProjectHistory history = userProjectHistoryRepository.findByIdAndUserId(historyId, userId)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND)); // 커스텀에러 추후 추가 예정

        userProjectHistoryRepository.delete(history);
    }


}