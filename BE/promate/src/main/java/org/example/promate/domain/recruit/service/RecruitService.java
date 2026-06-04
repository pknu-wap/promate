package org.example.promate.domain.recruit.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.apply.entity.Apply;
import org.example.promate.domain.apply.repository.ApplyRepository;
import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.enums.Position;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.project.repository.ProjectRepository;
import org.example.promate.domain.recruit.dto.request.RecruitCreateRequest;
import org.example.promate.domain.recruit.dto.request.RecruitSearchCondition;
import org.example.promate.domain.recruit.dto.request.RecruitStatusRequest;
import org.example.promate.domain.recruit.dto.request.RecruitUpdateRequest;
import org.example.promate.domain.recruit.dto.response.*;
import org.example.promate.domain.recruit.entity.Bookmark;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.enums.RecruitStatus;
import org.example.promate.domain.recruit.repository.BookmarkRepository;
import org.example.promate.domain.recruit.repository.RecruitRepository;
import org.example.promate.domain.review.entity.MemberReview;
import org.example.promate.domain.review.repository.MemberReviewRepository;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.exception.UserErrorCode;
import org.example.promate.domain.user.repository.UserProjectHistoryRepository;
import org.example.promate.domain.user.repository.UserRepository;
import org.example.promate.domain.recruit.code.RecruitErrorCode;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.example.promate.domain.workspace.repository.TaskRepository;
import org.example.promate.global.ApiPayload.exception.GeneralException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecruitService {

    private final RecruitRepository recruitRepository;
    private final UserRepository userRepository;
    private final ApplyRepository applyRepository; // 지원 내역 확인용
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final BookmarkRepository bookmarkRepository;
    private final MemberReviewRepository memberReviewRepository;
    private final TaskRepository taskRepository;
    private final UserProjectHistoryRepository userProjectHistoryRepository; // 팀장 수동입력 이력

    @Transactional
    public RecruitCreateResponse createRecruitment(
            RecruitCreateRequest request, Long userId)
    {
        User writer = userRepository.findById(userId).orElseThrow(() -> new GeneralException(UserErrorCode.USER_NOT_FOUND));
        Recruit recruit = Recruit.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .totalSlots(request.totalSlots())
                .user(writer)
                .build();

        // 임시 Project 객체 생성 (팀장이 팀 결정 OR 팀 빌딩 취소 결정)
        Project project = Project.builder()
                .title(request.title()) // 일단 모집글 제목을 프로젝트명으로 사용
                .description(request.description())
                .status(ProjectStatus.PREPARING) // 아직 시작 전 상태
                .startDate(request.startDate())
                .endDate(request.endDate())
                .recruit(recruit)
                .user(writer)
                .build();

        //팀장을 프로젝트의 첫 번째 Member로 등록
        Member leaderMember = Member.builder()
                .user(writer)
                .project(project)
                .role("팀장")
                .position(Position.LEADER)
                .build();

        Recruit savedRecruit = recruitRepository.save(recruit);
        projectRepository.save(project);
        memberRepository.save(leaderMember);

        return new RecruitCreateResponse(savedRecruit.getId());
    }

    public RecruitDetailResponse getRecruitmentDetail(Long recruitmentId, Long currentUserId) {
        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        boolean isAuthor = recruit.getUser().getId().equals(currentUserId);

        boolean hasApplied = applyRepository.existsByRecruitIdAndUserId(recruitmentId, currentUserId);
        int applicantCount = applyRepository.countByRecruitId(recruitmentId);

        LocalDate startDate = (recruit.getProject() != null) ? recruit.getProject().getStartDate() : null;
        LocalDate endDate = (recruit.getProject() != null) ? recruit.getProject().getEndDate() : null;

        return new RecruitDetailResponse(
                recruit.getId(),
                recruit.getTitle(),
                recruit.getDescription(),
                recruit.getCategory(),
                "RECRUITING", // 임시 상태값
                recruit.getCreatedAt(),
                recruit.getUpdatedAt(),
                new RecruitDetailResponse.AuthorDto(
                        recruit.getUser().getId(),
                        recruit.getUser().getName(),
                        recruit.getUser().getProfileImageUrl()
                ),
                isAuthor,
                hasApplied,
                applicantCount,

                startDate,
                endDate,
                recruit.getTotalSlots(),
                recruit.getJoinedCount()
        );
    }

    @Transactional
    public void updateRecruitment(Long recruitmentId, RecruitUpdateRequest request, Long userId) {

        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        if (!recruit.getUser().getId().equals(userId)) {
            throw new GeneralException(RecruitErrorCode.NOT_RECRUITMENT_AUTHOR);
        }

        recruit.update(request.title(), request.content());
    }

    @Transactional
    public void deleteRecruitment(Long recruitmentId, Long userId) {

        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        if (!recruit.getUser().getId().equals(userId)) {
            throw new GeneralException(RecruitErrorCode.NOT_RECRUITMENT_AUTHOR);
        }

        if (recruit.getStatus() == RecruitStatus.RECRUITING) {
            // CASE 1: 모집 중일 때는 Hard Delete
            // -> cascade = CascadeType.ALL 설정에 의해 Project, Apply도 DB에서 통째로 지움
            recruitRepository.delete(recruit);
        } else {
            // CASE 2: 이미 마감되었거나 진행 중일 때는 프로젝트 보호를 위해 겉만 숨김 (Soft Delete)
            // -> 이래야 다른 팀원들이 프로젝트 내역에서 쫓겨나지 않음
            recruit.delete(); // super.performDelete() 호출하여 is_deleted = true 변경
        }
    }


    /* userId는 보안 검증 X , 로직 분기용(모집글 조회 시 지원 상태 제공)
    userId != null (로그인 유저) -> 쿼리를 날려 심사중, 합격 등 상태를 채워줌
    userId == null (비로그인 유저) -> 지원 상태를 전부 null로 채움*/
    public RecruitPageResponse<RecruitResponse> getRecruitments(RecruitSearchCondition condition, Pageable pageable, Long currentUserId) {
        // 1. 레포지토리에서 순수 엔티티 페이징 데이터 가져오기
        Page<Recruit> recruitPage = recruitRepository.searchRecruits(condition, pageable);

        // 2. 로그인 유저 상태에 맞게 지원 상태를 결합
        List<RecruitResponse> dtoList = enrichRecruitmentsWithApplyStatus(recruitPage.getContent(), currentUserId);

        Page<RecruitResponse> resultPage = new PageImpl<>(dtoList, pageable, recruitPage.getTotalElements());

        return RecruitPageResponse.of(resultPage);
    }



    @Transactional
    public RecruitStatusResponse changeRecruitStatus(Long recruitmentId, Long userId, RecruitStatusRequest request) {
        // 모집글 조회 및 권한 확인
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        if (!recruit.getUser().getId().equals(userId)) {
            throw new GeneralException(RecruitErrorCode.NOT_RECRUITMENT_AUTHOR);
        }

        // 핵심 제약 조건: 현재 상태가 RECRUITING이 아니면 상태 변경 불가
        // (이 로직은 지원하기 / 합격,불합격 판정 API에도 추가)
        if (recruit.getStatus() != RecruitStatus.RECRUITING) {
            throw new GeneralException(RecruitErrorCode.RECRUITMENT_ALREADY_CLOSED);
        }

        if (request.status() == RecruitStatus.COMPLETED) {
            return processCompletion(recruit);
        }

        // 그 외 상태 변경 로직(모집글 soft delete 사용 채택 하면)
        //recruit.updateStatus(request.status());
        return new RecruitStatusResponse(null, recruit.getStatus());
    }

    public RecruitStatusResponse processCompletion(Recruit recruit) {
        // 임시 프로젝트 상태 변경 (PREPARING -> ACTIVE)
        Project project = recruit.getProject();
        if (project == null) {
            throw new GeneralException(RecruitErrorCode.PROJECT_NOT_FOUND);
        }

        recruit.updateStatus(RecruitStatus.COMPLETED);
        project.updateStatus(ProjectStatus.ACTIVE);


        return new RecruitStatusResponse(project.getId(), RecruitStatus.COMPLETED);
    }

    @Transactional
    public BookmarkResponse toggleBookmark(Long recruitmentId, Long userId) {
        // 게시글 존재 확인
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        User user = userRepository.getReferenceById(userId);

        // 이미 북마크했는지 확인
        Optional<Bookmark> optionalBookmark = bookmarkRepository.findByUserAndRecruit(user, recruit);

        if (optionalBookmark.isPresent()) {
            // 이미 있다면 북마크 취소
            bookmarkRepository.delete(optionalBookmark.get());
            return new BookmarkResponse(recruitmentId, false);
        } else {
            // 없다면 북마크 등록
            bookmarkRepository.save(new Bookmark(user, recruit));
            return new BookmarkResponse(recruitmentId, true);
        }
    }

    public RecruitPageResponse<RecruitResponse> getBookmarkedRecruitments(Long currentUserId, Pageable pageable) {

        userRepository.findById(currentUserId).orElseThrow(() -> new GeneralException(UserErrorCode.USER_NOT_FOUND));

        Page<Bookmark> bookmarkPage = bookmarkRepository.findByUserIdWithRecruit(currentUserId, pageable);

        List<Recruit> bookmarkedRecruits = bookmarkPage.getContent().stream()
                .map(Bookmark::getRecruit)
                .toList();

        // 상태 결합 함수를 호출
        List<RecruitResponse> dtoList = enrichRecruitmentsWithApplyStatus(bookmarkedRecruits, currentUserId);

        Page<RecruitResponse> resultPage = new PageImpl<>(dtoList, pageable, bookmarkPage.getTotalElements());

        return RecruitPageResponse.of(resultPage);
    }

    /* 다른 API에서 사용하는 메서드,
    1. "북마크 했으나 최종 탈락한 프로젝트는 상세 내역 확인 못 들어가게"
    2. "팀 찾기 페이지에서 각 모집글 옆에, 본인의 지원 상태(심사 전, 합격, 불합격)를 반환하는 필드 추가"

    해당 분기점 발생을 위해 userId 존재 시, 특정 모집글에 대한 지원글의 status + ID를 가져옴.
    */
    private List<RecruitResponse> enrichRecruitmentsWithApplyStatus(List<Recruit> recruits, Long userId) {
        if (recruits.isEmpty()) return Collections.emptyList();

        Map<Long, Apply> applyMap = new HashMap<>();

        // 로그인한 유저인 경우에만 쿼리로 지원서들을 한 번에 싹 긁어옴
        if (userId != null) {
            List<Long> recruitIds = recruits.stream().map(Recruit::getId).toList();
            List<Apply> myApplies = applyRepository.findByUserIdAndRecruitIdIn(userId, recruitIds);
            applyMap = myApplies.stream()
                    .collect(Collectors.toMap(apply -> apply.getRecruit().getId(), apply -> apply));
        }

        Map<Long, Apply> finalApplyMap = applyMap;

        return recruits.stream().map(recruit -> {
            Apply myApply = finalApplyMap.get(recruit.getId());

            return RecruitResponse.of(
                    recruit,
                    myApply != null ? myApply.getStatus() : null,
                    myApply != null ? myApply.getId() : null,
                    userId
            );
        }).toList();
    }

    /*
    public void processExpiration(Recruit recruit) {

        recruit.updateStatus(RecruitStatus.EXPIRED);

        // 임시 프로젝트 데이터 청소 (Hard Delete)
        // 팀 빌딩에 실패했으므로 가동되지 못한 임시 프로젝트와 팀장 멤버 데이터는 제거
        Project project = recruit.getProject();
        if (project != null) {
            recruit.disconnectProject();
            projectRepository.delete(project);
        }
        //지원서 청소
        applyRepository.deleteAllByRecruitId(recruit.getId());
    }*/


    //내가 생성한 모집글들 불러오기
    public RecruitPageResponse<MyRecruitResponse> getMyRecruitments(Long userId, Pageable pageable) {

        Page<Recruit> recruitPage = recruitRepository.findActiveRecruitmentsByUserId(userId,pageable);

        Page<MyRecruitResponse> mappedPage = recruitPage.map(MyRecruitResponse::from);

        return RecruitPageResponse.of(mappedPage);
    }

    public RecruitLeaderProfileResponse getRecruitLeaderProfile(Long recruitmentId) {

        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        User leader = recruit.getUser();
        Long leaderId = leader.getId();

        List<Member> members = memberRepository.findByUserIdWithProject(leaderId);

        List<RecruitLeaderProfileResponse.ProjectHistoryDTO> projects = members.stream()
                .map(member -> {
                    Project project = member.getProject();

                    List<MemberReview> reviews =
                            memberReviewRepository.findByProjectIdAndRevieweeId(
                                    project.getId(),
                                    leaderId
                            );

                    double averageReviewScore = reviews.stream()
                            .mapToDouble(review ->
                                    (review.getCommunicationScore()
                                            + review.getProactivenessScore()
                                            + review.getResponsibilityScore()
                                            + review.getProblemSolvingScore()) / 4.0
                            )
                            .average()
                            .orElse(0.0);

                    int completedTaskCount =
                            taskRepository.countByProjectIdAndMemberIdAndStatus(
                                    project.getId(),
                                    member.getId(),
                                    TaskStatus.DONE
                            );

                    int incompleteTaskCount =
                            taskRepository.countByProjectIdAndMemberIdAndStatusIn(
                                    project.getId(),
                                    member.getId(),
                                    List.of(TaskStatus.TODO, TaskStatus.IN_PROGRESS)
                            );

                    return RecruitLeaderProfileResponse.ProjectHistoryDTO.builder()
                            .historyId(null)
                            .projectId(project.getId())
                            .projectTitle(project.getTitle())
                            .role(member.getRole())
                            .position(member.getPosition().name())
                            .projectStatus(project.getStatus())
                            .startDate(project.getStartDate())
                            .endDate(project.getEndDate())
                            .description(project.getDescription())
                            .source("PROMATE")
                            .averageReviewScore(averageReviewScore)
                            .reviewCount((long) reviews.size())
                            .completedTaskCount(completedTaskCount)
                            .incompleteTaskCount(incompleteTaskCount)
                            .build();
                })
                .toList();

        List<RecruitLeaderProfileResponse.ProjectHistoryDTO> manualProjects =
                userProjectHistoryRepository.findByUserId(leaderId)
                        .stream()
                        .map(history -> RecruitLeaderProfileResponse.ProjectHistoryDTO.builder()
                                .historyId(history.getId())
                                .projectId(null)
                                .projectTitle(history.getProjectName())
                                .role(history.getRole())
                                .position(null)
                                .projectStatus(history.getStatus())
                                .startDate(history.getStartDate())
                                .endDate(history.getEndDate())
                                .description(history.getDescription())
                                .source("MANUAL")
                                .averageReviewScore(0.0)
                                .reviewCount(0L)
                                .completedTaskCount(0)
                                .incompleteTaskCount(0)
                                .build())
                        .toList();

        List<RecruitLeaderProfileResponse.ProjectHistoryDTO> allProjects = new ArrayList<>();
        allProjects.addAll(projects);
        allProjects.addAll(manualProjects);

        Double totalAverageReviewScore =
                memberReviewRepository.getGlobalAverageScoreByUserId(leaderId);

        int totalCompletedTaskCount = projects.stream()
                .mapToInt(RecruitLeaderProfileResponse.ProjectHistoryDTO::getCompletedTaskCount)
                .sum();

        int totalIncompleteTaskCount = projects.stream()
                .mapToInt(RecruitLeaderProfileResponse.ProjectHistoryDTO::getIncompleteTaskCount)
                .sum();

        long totalReviewCount = projects.stream()
                .mapToLong(RecruitLeaderProfileResponse.ProjectHistoryDTO::getReviewCount)
                .sum();

        return RecruitLeaderProfileResponse.builder()
                .leaderId(leader.getId())
                .leaderName(leader.getName())
                .profileImageUrl(leader.getProfileImageUrl())
                .averageReviewScore(totalAverageReviewScore != null ? totalAverageReviewScore : 0.0)
                .reviewCount(totalReviewCount)
                .completedTaskCount(totalCompletedTaskCount)
                .incompleteTaskCount(totalIncompleteTaskCount)
                .projects(allProjects)
                .build();


    }
}
