package org.example.promate.domain.project.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.apply.repository.ApplyRepository;
import org.example.promate.domain.project.code.MemberErrorCode;
import org.example.promate.domain.project.code.ProjectErrorCode;
import org.example.promate.domain.project.dto.MyActivityResponseDTO;
import org.example.promate.domain.project.dto.MyApplicationResponseDTO;
import org.example.promate.domain.project.dto.MyProjectResponseDTO;
import org.example.promate.domain.project.dto.ProjectMemberResponseDTO;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.example.promate.domain.project.exception.MemberException;
import org.example.promate.domain.project.exception.ProjectException;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.project.repository.ProjectRepository;
import org.example.promate.domain.recruit.repository.RecruitRepository;
import org.example.promate.domain.review.entity.MemberReview;
import org.example.promate.domain.review.repository.MemberReviewRepository;
import org.example.promate.domain.user.repository.UserRepository;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.example.promate.domain.workspace.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final RecruitRepository recruitRepository;
    private final ApplyRepository applyRepository;
    private final MemberRepository memberRepository;
    private final TaskRepository taskRepository;
    private final MemberReviewRepository memberReviewRepository;


    @Transactional(readOnly = true)
    public List<MyApplicationResponseDTO> getMyApplications(Long userId) {
        return applyRepository.findByUserIdWithRecruit(userId)
                .stream()
                .map(apply -> MyApplicationResponseDTO.builder()
                        .applicationId(apply.getId())
                        .recruitmentId(apply.getRecruit().getId())
                        .title(apply.getRecruit().getTitle())
                        .status(apply.getStatus())
                        .createdAt(apply.getCreatedAt())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MyProjectResponseDTO> getMyProjects(Long userId) {
        return memberRepository.findByUserIdAndProjectStatus(
                        userId,
                        ProjectStatus.ACTIVE
                )
                .stream()
                .map(member -> {
                    Project project = member.getProject();

                    int completedTaskCount =
                            taskRepository.countAllByProjectIdAndStatusAndIsDeletedFalse(
                                    project.getId(),
                                    TaskStatus.DONE
                            );

                    int incompleteTaskCount =
                            taskRepository.countAllByProjectIdAndStatusInAndIsDeletedFalse(
                                    project.getId(),
                                    List.of(TaskStatus.TODO, TaskStatus.IN_PROGRESS)
                            );

                    return MyProjectResponseDTO.builder()
                            .projectId(project.getId())
                            .title(project.getTitle())
                            .projectStatus(project.getStatus())
                            .completedTaskCount(completedTaskCount)
                            .incompleteTaskCount(incompleteTaskCount)
                            .build();
                })
                .toList();
    }

    private double calculateAverageReviewScore(Long projectId, Long userId) {

        List<MemberReview> reviews =
                memberReviewRepository.findByProjectIdAndRevieweeId(
                        projectId,
                        userId
                );

        return reviews.stream()
                .flatMapToInt(review -> IntStream.of(
                        review.getCommunicationScore(),
                        review.getProactivenessScore(),
                        review.getResponsibilityScore(),
                        review.getProblemSolvingScore()
                ))
                .average()
                .stream()
                .map(avg -> Math.round(avg * 10) / 10.0)
                .findFirst()
                .orElse(0.0);
    }

    @Transactional(readOnly = true)
    public List<MyActivityResponseDTO> getMyActivities(Long userId) {


        return memberRepository
                .findByUserIdAndProjectStatus(userId, ProjectStatus.COMPLETED)
                .stream()
                .map(member -> {
                    double averageReviewScore =
                            calculateAverageReviewScore(
                                    member.getProject().getId(),
                                    userId
                            );
                    return MyActivityResponseDTO.builder()
                            .projectId(member.getProject().getId())
                            .title(member.getProject().getTitle())
                            .averageReviewScore(averageReviewScore)
                            .build();
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectMemberResponseDTO> getProjectMembers(
            Long userId,
            Long projectId
    ) {
        projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectException(ProjectErrorCode.ID_NOT_FOUND));

        boolean isProjectMember =
                memberRepository.existsByProjectIdAndUserIdAndIsDeletedFalse(
                        projectId,
                        userId
                );

        if (!isProjectMember) {
            throw new MemberException(MemberErrorCode.MEMBER_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        return memberRepository.findAllByProjectIdAndIsDeletedFalse(projectId)
                .stream()
                .map(member -> ProjectMemberResponseDTO.builder()
                        .userId(member.getUser().getId())
                        .name(member.getUser().getName())
                        .build())
                .toList();
    }
}
