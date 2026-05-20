package org.example.promate.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.user.dto.*;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.entity.UserProjectHistory;
import org.example.promate.domain.user.exception.UserErrorCode;
import org.example.promate.domain.user.exception.UserException;
import org.example.promate.domain.user.repository.UserProjectHistoryRepository;
import org.example.promate.domain.user.repository.UserRepository;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.example.promate.domain.workspace.repository.TaskRepository;
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
                .orElseThrow(() -> new UserException(UserErrorCode.PROJECT_HISTORY_NOT_FOUND)); // 커스텀에러 추후 추가 예정

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
                .orElseThrow(() -> new UserException(UserErrorCode.PROJECT_HISTORY_NOT_FOUND)); // 커스텀에러 추후 추가 예정

        userProjectHistoryRepository.delete(history);
    }

    private final MemberRepository memberRepository;
    private final TaskRepository taskRepository;

    public List<ProjectTaskCountResponseDTO> getProjectTaskCounts(Long userId) {
        return memberRepository.findByUserId(userId)
                .stream()
                .map(member -> {
                    Project project = member.getProject();

                    int completedCount = taskRepository.countByProjectIdAndStatus(
                            project.getId(),
                            TaskStatus.DONE
                    );

                    int incompleteCount = taskRepository.countByProjectIdAndStatusIn(
                            project.getId(),
                            List.of(TaskStatus.TODO, TaskStatus.IN_PROGRESS)
                    );

                    return ProjectTaskCountResponseDTO.builder()
                            .projectId(project.getId())
                            .projectTitle(project.getTitle())
                            .completedTaskCount(completedCount)
                            .incompleteTaskCount(incompleteCount)
                            .build();
                })
                .toList();
    }


}