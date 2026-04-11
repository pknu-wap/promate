package org.example.promate.domain.workspace.service.query;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.project.code.MemberErrorCode;
import org.example.promate.domain.project.exception.MemberException;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.workspace.code.TaskErrorCode;
import org.example.promate.domain.workspace.converter.TaskConverter;
import org.example.promate.domain.workspace.dto.res.TaskResDto;
import org.example.promate.domain.workspace.entity.Task;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.example.promate.domain.workspace.exception.TaskException;
import org.example.promate.domain.workspace.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskQueryServiceImpl implements TaskQueryService {
    private final MemberRepository memberRepository;
    private final TaskRepository taskRepository;

    // 프로젝트 내 모든 태스크 조회
    @Override
    public TaskResDto.TaskPreviewInfoListDto getTaskPreviewList(Long userId, Long projectId) {
        // 검증: 로그인 사용자가 프로젝트 멤버인가
        if (!memberRepository.existsByUserIdAndProjectId(userId, projectId)) {
            throw new MemberException(MemberErrorCode.NOT_PROJECT_MEMBER);
        }

        List<Task> taskList = taskRepository.findByProjectIdAndIsDeletedFalse(projectId);

        return TaskConverter
                .toTaskPreviewListInfoDto(taskList, taskList.size(), calculateProjectProgress(projectId));
    }

    // 특정 태스크 조회
    @Override
    public TaskResDto.TaskInfoDto getTask(Long userId, Long projectId, Long taskId) {
        // 검증: 로그인 사용자가 프로젝트 멤버인가
        if (!memberRepository.existsByUserIdAndProjectId(userId, projectId)) {
            throw new MemberException(MemberErrorCode.NOT_PROJECT_MEMBER);
        }

        Task task = taskRepository.findByIdAndIsDeletedFalse(taskId)
                .orElseThrow(() -> new TaskException(TaskErrorCode.ID_NOT_FOUND));

        return TaskConverter.toTaskInfoDto(task);
    }

    // 프로젝트 진행률 계산
    @Override
    public double calculateProjectProgress(Long projectId) {
        int totalTaskCount = taskRepository.countAllByProjectIdAndIsDeletedFalse(projectId);

        if (totalTaskCount == 0) {
            throw new TaskException(TaskErrorCode.EMPTY_PROJECT_TASKS);
        }

        int completedTaskCount = taskRepository.countAllByProjectIdAndStatusAndIsDeletedFalse(projectId, TaskStatus.DONE);

        // 진행률 계산 후 소수점 한 자리 반올림
        return Math.round(((double) completedTaskCount / totalTaskCount) * 1000) / 10.0;
    }
}
