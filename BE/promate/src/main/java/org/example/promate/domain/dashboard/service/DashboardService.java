package org.example.promate.domain.dashboard.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.dashboard.dto.DashboardResponseDTO;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.workspace.entity.Task;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.example.promate.domain.workspace.repository.ScheduleRepository;
import org.example.promate.domain.workspace.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final MemberRepository memberRepository;
    private final TaskRepository taskRepository;
    private final ScheduleRepository scheduleRepository;

    public List<DashboardResponseDTO.MyProjectDTO> getMyProjects(Long userId) {
        return memberRepository.findByUserIdAndProjectStatus(userId, ProjectStatus.ACTIVE)
                .stream()
                .map(member -> {
                    Project project = member.getProject();

                    return DashboardResponseDTO.MyProjectDTO.builder()
                            .projectId(project.getId())
                            .title(project.getTitle())
                            .endDate(project.getEndDate())
                            .dueStatus(getDueStatus(project.getEndDate()))
                            .build();
                })
                .toList();
    }

    public List<DashboardResponseDTO.TaskDTO> getDeadlineTasks(Long userId) {
        LocalDate now = LocalDate.now();
        LocalDate sevenDaysLater = now.plusDays(7);

        return taskRepository
                .findByMemberUserIdAndDueDateBetweenAndIsDeletedFalse(
                        userId,
                        now,
                        sevenDaysLater
                )
                .stream()
                .map(this::toTaskDTO)
                .toList();
        }

    public List<DashboardResponseDTO.TaskDTO> getCompletedTasks(Long userId) {
        return taskRepository
                .findByMemberUserIdAndStatusAndIsDeletedFalse(
                        userId,
                        TaskStatus.DONE
                )
                .stream()
                .map(this::toTaskDTO)
                .toList();
    }

    public List<DashboardResponseDTO.CalendarDTO> getCalendar(Long userId) {
        List<Long> projectIds = memberRepository.findByUserIdAndProjectStatus(userId, ProjectStatus.ACTIVE)
                .stream()
                .map(member -> member.getProject().getId())
                .toList();

        if (projectIds.isEmpty()) {
            return List.of();
        }

        return scheduleRepository.findByProjectIdInAndIsDeletedFalse(projectIds)
                .stream()
                .map(schedule -> DashboardResponseDTO.CalendarDTO.builder()
                        .scheduleId(schedule.getId())
                        .projectId(schedule.getProject().getId())
                        .projectTitle(schedule.getProject().getTitle())
                        .title(schedule.getTitle())
                        .content(schedule.getContent())
                        .startAt(schedule.getStartAt())
                        .endAt(schedule.getEndAt())
                        .build())
                .toList();
    }

    public List<DashboardResponseDTO.ProjectStatusDTO> getProjectStatus(Long userId) {
        return memberRepository.findByUserIdAndProjectStatus(userId, ProjectStatus.ACTIVE)
                .stream()
                .map(member -> {
                    Project project = member.getProject();

                    Long totalTaskCount = (long) taskRepository.countAllByProjectIdAndIsDeletedFalse(project.getId());

                    Long completedTaskCount = (long) taskRepository.countAllByProjectIdAndStatusAndIsDeletedFalse(
                            project.getId(),
                            TaskStatus.DONE
                    );

                    // 완료된 태스크 비율 기준 진행률 계산(%), 전체 태스크 수가 0이면 그냥 0 반환
                    int progressRate = totalTaskCount == 0
                            ? 0
                            : (int) Math.round((double) completedTaskCount / totalTaskCount * 100);

                    return DashboardResponseDTO.ProjectStatusDTO.builder()
                            .projectId(project.getId())
                            .title(project.getTitle())
                            .endDate(project.getEndDate())
                            .dueStatus(getDueStatus(project.getEndDate()))
                            .completedTaskCount(completedTaskCount)
                            .totalTaskCount(totalTaskCount)
                            .progressRate(progressRate)
                            .build();
                })
                .toList();
    }

    private DashboardResponseDTO.TaskDTO toTaskDTO(Task task) {
        return DashboardResponseDTO.TaskDTO.builder()
                .taskId(task.getId())
                .projectId(task.getProject().getId())
                .projectTitle(task.getProject().getTitle())
                .title(task.getTitle())
                .dueDate(task.getDueDate())
                .taskStatus(task.getStatus())
                .build();
    }

    // 마감일까지 남은 일수를 기준으로 상태 반환(7일 이하-임박, 그 외-여유)
    private String getDueStatus(LocalDate dueDate) {
        if (dueDate == null) {
            return "여유";
        }

        long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), dueDate);

        if (daysLeft <= 7) {
            return "임박";
        }

        return "여유";
    }
}