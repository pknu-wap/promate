package org.example.promate.domain.project.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.apply.entity.Apply;
import org.example.promate.domain.apply.repository.ApplyRepository;
import org.example.promate.domain.project.code.MemberErrorCode;
import org.example.promate.domain.project.code.ProjectErrorCode;
import org.example.promate.domain.project.dto.MyActivityResponseDTO;
import org.example.promate.domain.project.dto.MyApplicationResponseDTO;
import org.example.promate.domain.project.dto.MyProjectResponseDTO;
import org.example.promate.domain.project.dto.ProjectMemberResponseDTO;
import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.example.promate.domain.project.exception.MemberException;
import org.example.promate.domain.project.exception.ProjectException;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.project.repository.ProjectRepository;
import org.example.promate.domain.recruit.repository.BookmarkRepository;
import org.example.promate.domain.recruit.repository.RecruitRepository;
import org.example.promate.domain.review.entity.MemberReview;
import org.example.promate.domain.review.repository.MemberReviewRepository;
import org.example.promate.domain.user.repository.UserRepository;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.example.promate.domain.workspace.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
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
    private final BookmarkRepository bookmarkRepository;

    @Transactional(readOnly = true)
    public List<MyApplicationResponseDTO> getMyApplications(Long userId) {
        // 지원서 목록 조회
        List<Apply> myApplies = applyRepository.findByUserIdWithRecruit(userId);

        // 북마크 여부 조회
        List<Long> recruitIds = myApplies.stream().map(apply -> apply.getRecruit().getId()).toList();
        Set<Long> bookmarkedRecruitIds = bookmarkRepository.findBookmarkedRecruitIds(userId, recruitIds);

        return myApplies.stream()
                .map(apply -> MyApplicationResponseDTO.builder()
                        .applicationId(apply.getId())
                        .recruitmentId(apply.getRecruit().getId())
                        .title(apply.getRecruit().getTitle())
                        .description(apply.getRecruit().getDescription())
                        .recruitCount(apply.getRecruit().getTotalSlots())
                        .status(apply.getStatus())
                        .createdAt(apply.getCreatedAt())
                        .isBookmarked(bookmarkedRecruitIds.contains(apply.getRecruit().getId()))
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
                            .startDate(project.getStartDate())
                            .endDate(project.getEndDate())
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
        // 멤버 활동 목록 조회
        List<Member> myMembers = memberRepository.findByUserIdAndProjectStatus(userId, ProjectStatus.COMPLETED);

        // 프로젝트의 모집글에 대한 북마크 여부 판단
        List<Long> recruitIds = myMembers.stream()
                .map(member -> member.getProject().getRecruit().getId()) // 프로젝트로 모집글 ID 추출
                .toList();
        Set<Long> bookmarkedRecruitIds = bookmarkRepository.findBookmarkedRecruitIds(userId, recruitIds);

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
                            .description(member.getProject().getDescription())
                            .startDate(member.getProject().getStartDate())
                            .endDate(member.getProject().getEndDate())
                            .averageReviewScore(averageReviewScore)
                            .isBookmarked(bookmarkedRecruitIds.contains(member.getProject().getRecruit().getId()))
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
