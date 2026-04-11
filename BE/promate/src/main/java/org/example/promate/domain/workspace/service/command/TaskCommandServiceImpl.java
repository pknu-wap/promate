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

    //TODO: 로그인 사용자 검증 부분 리팩토링 -> 중복 코드 많음

    @Override
    public TaskResDto.TaskInfoDto addTask(Long userId, Long projectId, TaskReqDto.AddTaskDto dto) {
        // 검증1: 로그인 사용자가 프로젝트 멤버인지
        if(!memberRepository.existsByUserIdAndProjectId(userId, projectId)){
            throw new MemberException(MemberErrorCode.NOT_PROJECT_MEMBER);
        }

        // 프로젝트 찾기
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectException(ProjectErrorCode.ID_NOT_FOUND));

        // 검증2: 담당자 ID가 프로젝트 멤버가 맞는지
        Member member = memberRepository.findByIdAndProjectId(dto.getManagerId(), projectId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.NOT_PROJECT_MEMBER));

        // 태스크 엔티티 추가
        Task task = TaskConverter.toEntity(dto, project, member);
        taskRepository.save(task);

        return TaskConverter.toTaskInfoDto(task);
    }

    @Override
    public TaskResDto.ModifiedTaskInfoDto modifyTask(Long userId, Long projectId, Long taskId, TaskReqDto.ModifyTaskDto dto) {
        Task task = taskRepository.findByIdAndIsDeletedFalse(taskId)
                .orElseThrow(() -> new TaskException(TaskErrorCode.ID_NOT_FOUND));

        // 로그인 사용자의 멤버 정보
        Member member = memberRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.NOT_PROJECT_MEMBER));

        Member currentTaskManager = task.getMember();

        // 검증1: 해당 프로젝트의 태스크인가
        if(!projectId.equals(task.getProject().getId())){
            throw new TaskException(TaskErrorCode.NOT_PROJECT_TASK);
        }

        // 검증2: 수정 권한 검증. 팀장이나 태스크 담당 본인만 수정 가능
        boolean isAssignee = currentTaskManager.equals(member);
        boolean isLeader = member.getPosition() == Position.LEADER;

        if (!isAssignee && !isLeader) {
            throw new TaskException(TaskErrorCode.NOT_ASSIGNEE_OR_PROJECT_LEADER);
        }

        // 태스크 수정
        task.modify(dto);
        // 태스크 담당자 변경
        if(!currentTaskManager.getId().equals(dto.getManagerId())){
            // 검증3: 변경할 태스크 담당자가 프로젝트의 멤버가 맞는가
            Member newTaskManager = memberRepository.findByIdAndProjectId(dto.getManagerId(), projectId)
                    .orElseThrow(() -> new MemberException(MemberErrorCode.NOT_PROJECT_MEMBER));
            task.modify(newTaskManager);
        }

        return TaskConverter.toModifiedTaskInfoDto(task);
    }

    @Override
    public TaskResDto.UpdatedStatusTaskInfoDto updateTaskStatus(Long userId, Long projectId, Long taskId, TaskReqDto.UpdateTaskStatusDto dto) {
        Task task = taskRepository.findByIdAndIsDeletedFalse(taskId)
                .orElseThrow(() -> new TaskException(TaskErrorCode.ID_NOT_FOUND));
        Member member = task.getMember();

        // 검증: 상태 업데이트는 태스크 담당자 본인만
        if(!userId.equals(member.getUser().getId())){
            throw new TaskException(TaskErrorCode.NOT_ASSIGNEE);
        }

        // 상태 업데이트
        task.updateStatus(dto.getStatus());

        // 진행률
        double projectProgress = taskQueryService.calculateProjectProgress(projectId);

        // 프로젝트 태스크 완료 여부
        boolean isProjectCompleted = (projectProgress == 100.0);

        return TaskConverter.toUpdatedStatusTaskInfoDto(task, projectProgress, isProjectCompleted);
    }

    @Override
    public TaskResDto.DeletedTaskInfoDto deleteTask(Long userId, Long projectId, Long taskId) {
        Task task = taskRepository.findByIdAndIsDeletedFalse(taskId)
                .orElseThrow(() -> new TaskException(TaskErrorCode.ID_NOT_FOUND));
        Member currentTaskManager = task.getMember();

        // 로그인 사용자의 프로젝트 멤버 정보
        Member member = memberRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.NOT_PROJECT_MEMBER));

        // 검증: 태스크 삭제는 태스크 담당자 본인과 프로젝트 팀장만
        boolean isAssignee = currentTaskManager.equals(member);
        boolean isLeader = member.getPosition() == Position.LEADER;
        if(!isAssignee && !isLeader){
            throw new TaskException(TaskErrorCode.NOT_ASSIGNEE_OR_PROJECT_LEADER);
        }

        task.delete();

        return TaskConverter.toDeletedTaskInfoDto(task);
    }
}
