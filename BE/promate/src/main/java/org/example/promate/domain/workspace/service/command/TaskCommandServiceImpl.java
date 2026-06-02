package org.example.promate.domain.workspace.service.command;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.project.code.MemberErrorCode;
import org.example.promate.domain.project.code.ProjectErrorCode;
import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.enums.Position;
import org.example.promate.domain.project.exception.MemberException;
import org.example.promate.domain.project.exception.ProjectException;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.project.repository.ProjectRepository;
import org.example.promate.domain.workspace.code.TaskErrorCode;
import org.example.promate.domain.workspace.converter.TaskConverter;
import org.example.promate.domain.workspace.dto.req.TaskReqDto;
import org.example.promate.domain.workspace.dto.res.TaskResDto;
import org.example.promate.domain.workspace.entity.Task;
import org.example.promate.domain.workspace.exception.TaskException;
import org.example.promate.domain.workspace.repository.TaskRepository;
import org.example.promate.domain.workspace.service.query.TaskQueryService;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Transactional
public class TaskCommandServiceImpl implements TaskCommandService{
    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final TaskQueryService taskQueryService;

    // 태스크 추가하기
    @Override
    public TaskResDto.TaskInfoDto addTask(Long userId, Long projectId, TaskReqDto.AddTaskDto dto) {
        // 검증1: 로그인 사용자가 프로젝트 멤버인지
        if(!memberRepository.existsByUserIdAndProjectId(userId, projectId)){
            throw new MemberException(MemberErrorCode.TASK_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        // 프로젝트 찾기
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectException(ProjectErrorCode.ID_NOT_FOUND));

        // 검증2: 담당자 ID가 프로젝트 멤버가 맞는지(managerId는 userId)
        Member member = memberRepository.findByUserIdAndProjectId(dto.getManagerId(), projectId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.TASK_FORBIDDEN_NOT_PROJECT_MEMBER));


        // 태스크 엔티티 추가
        Task task = TaskConverter.toEntity(dto, project, member);
        taskRepository.save(task);

        return TaskConverter.toTaskInfoDto(task);
    }

    // 태스크 수정하기
    @Override
    public TaskResDto.ModifiedTaskInfoDto modifyTask(Long userId, Long projectId, Long taskId, TaskReqDto.ModifyTaskDto dto) {
        Task task = taskRepository.findByIdAndIsDeletedFalse(taskId)
                .orElseThrow(() -> new TaskException(TaskErrorCode.ID_NOT_FOUND));

        Member member = memberRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.TASK_FORBIDDEN_NOT_PROJECT_MEMBER));

        Member currentTaskManager = task.getMember();

        if(!projectId.equals(task.getProject().getId())){
            throw new TaskException(TaskErrorCode.NOT_PROJECT_TASK);
        }

        boolean isAssignee = currentTaskManager.getId().equals(member.getId());
        boolean isLeader = member.getPosition() == Position.LEADER;

        if (!isAssignee && !isLeader) {
            throw new TaskException(TaskErrorCode.NOT_ASSIGNEE_OR_PROJECT_LEADER);
        }

        // 1. 담당자 변경 여부 체크 및 객체 확보
        Member newTaskManager = currentTaskManager;
        if (currentTaskManager.getUser() == null || !currentTaskManager.getUser().getId().equals(dto.getManagerId())) {
            newTaskManager = memberRepository.findByUserIdAndProjectId(dto.getManagerId(), projectId)
                    .orElseThrow(() -> new MemberException(MemberErrorCode.TASK_FORBIDDEN_NOT_PROJECT_MEMBER));
        }

        // 2. 한 번에 수정 요청 (Task 엔티티 내부에서 dto와 manager를 한 번에 처리하도록 메서드를 만들면 베스트)
        task.modify(dto, newTaskManager);

        taskRepository.saveAndFlush(task);

        return TaskConverter.toModifiedTaskInfoDto(task);
    }

    // 태스크 상태 변경 : TODO, IN_PROGRESS, DONE
    @Override
    public TaskResDto.UpdatedStatusTaskInfoDto updateTaskStatus(Long userId, Long projectId, Long taskId, TaskReqDto.UpdateTaskStatusDto dto) {
        if(!memberRepository.existsByUserIdAndProjectId(userId, projectId)){
            throw new MemberException(MemberErrorCode.TASK_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        Task task = taskRepository.findByIdAndIsDeletedFalse(taskId)
                .orElseThrow(() -> new TaskException(TaskErrorCode.ID_NOT_FOUND));
        Member assignee = task.getMember();

        if (assignee.getUser() != null && assignee.getUser().getId().equals(userId)) {
            throw new TaskException(TaskErrorCode.CANNOT_UPDATE_SELF_TASK);
        }

        task.updateStatus(dto.getStatus());

        double projectProgress = taskQueryService.calculateProjectProgress(projectId);
        boolean isProjectCompleted = (projectProgress == 100.0);

        return TaskConverter.toUpdatedStatusTaskInfoDto(task, projectProgress, isProjectCompleted);
    }

    // 태스크 삭제하기
    @Override
    public TaskResDto.DeletedTaskInfoDto deleteTask(Long userId, Long projectId, Long taskId) {
        Task task = taskRepository.findByIdAndIsDeletedFalse(taskId)
                .orElseThrow(() -> new TaskException(TaskErrorCode.ID_NOT_FOUND));

        // 해당 프로젝트의 태스크가 맞는가
        if(!projectId.equals(task.getProject().getId())){
            throw new TaskException(TaskErrorCode.NOT_PROJECT_TASK);
        }

        Member currentTaskManager = task.getMember();

        // 로그인 사용자의 프로젝트 멤버 정보
        Member member = memberRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.TASK_FORBIDDEN_NOT_PROJECT_MEMBER));

        // 태스크 삭제는 태스크 담당자 본인과 프로젝트 팀장만
        boolean isAssignee = currentTaskManager.getId().equals(member.getId());
        boolean isLeader = member.getPosition() == Position.LEADER;
        if(!isAssignee && !isLeader){
            throw new TaskException(TaskErrorCode.NOT_ASSIGNEE_OR_PROJECT_LEADER);
        }

        task.delete();

        return TaskConverter.toDeletedTaskInfoDto(task);
    }
}
