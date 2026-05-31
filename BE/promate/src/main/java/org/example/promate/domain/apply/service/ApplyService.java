package org.example.promate.domain.apply.service;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.apply.dto.*;
import org.example.promate.domain.apply.entity.Apply;
import org.example.promate.domain.apply.entity.ApplyProject;
import org.example.promate.domain.apply.enums.Status;
import org.example.promate.domain.apply.repository.ApplicationProjectRepository;
import org.example.promate.domain.apply.repository.ApplyRepository;
import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.enums.Position;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.project.repository.ProjectRepository;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.enums.RecruitStatus;
import org.example.promate.domain.recruit.repository.RecruitRepository;
import org.example.promate.domain.recruit.service.RecruitService;
import org.example.promate.domain.review.repository.MemberReviewRepository;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.entity.UserProjectHistory;
import org.example.promate.domain.user.exception.UserErrorCode;
import org.example.promate.domain.user.repository.UserProjectHistoryRepository;
import org.example.promate.domain.user.repository.UserRepository;
import org.example.promate.domain.recruit.code.RecruitErrorCode;
import org.example.promate.domain.workspace.entity.Task;
import org.example.promate.domain.workspace.repository.TaskRepository;
import org.example.promate.global.ApiPayload.exception.GeneralException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ApplyService {

    private final ApplyRepository applyRepository;
    private final ApplicationProjectRepository applyProjectRepository;
    private final UserRepository userRepository;
    private final RecruitRepository recruitRepository;
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final TaskRepository taskRepository;
    private final UserProjectHistoryRepository userProjectHistoryRepository;
    private final MemberReviewRepository memberReviewRepository;
    private final RecruitService recruitService;


    public ApplyFormResponse getApplyForm(Long recruitmentId, Long userId) {
        // 모집글 제목 및 상태 검증 (Soft Delete 고려)
        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        validateRecruitingStatus(recruit);

        // 1.ProMate에서 완료된 프로젝트 조회 (isManual = false)
        List<Project> completedSystemProjects = projectRepository.findCompletedProjectsByUserId(userId);
        List<PastProjectDto> systemProjectDtos = completedSystemProjects.stream()
                .map(PastProjectDto::fromSystem)
                .toList();

        // 2. 수동 입력 프로젝트 조회 (isManual = true)
        List<UserProjectHistory> manualProjects = userProjectHistoryRepository.findByUserId(userId);
        List<PastProjectDto> manualProjectDtos = manualProjects.stream()
                .map(PastProjectDto::fromManual)
                .toList();

        // 3. 두 리스트를 하나로 융합
        List<PastProjectDto> combinedPastProjects = new ArrayList<>();
        combinedPastProjects.addAll(systemProjectDtos);
        combinedPastProjects.addAll(manualProjectDtos);

        // ApplyForm에서 작성 한 내용을 submit으로 제출 -> request body에 isManual도 추가로 들어감
        // -> ApplyProject 엔티티에서 구분하는 플래그 정보로 사용
        return ApplyFormResponse.of(recruit.getTitle(), combinedPastProjects);
    }


    @Transactional
    public ApplyResponse submit(Long recruitmentId, Long userId, ApplyRequest request) {

        // 중복 지원 방지 검증
        if (applyRepository.existsByRecruitIdAndUserIdAndIsDeletedFalse(recruitmentId, userId)) {
            throw new GeneralException(RecruitErrorCode.ALREADY_APPLIED);
        }

        // 연관 엔티티 조회
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() ->new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        validateRecruitingStatus(recruit);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new GeneralException(UserErrorCode.USER_NOT_FOUND));

        // 지원서 생성 및 저장
        Apply application = Apply.builder()
                .user(user)
                .recruit(recruit)
                .objective(request.getObjective())
                .prContent(request.getPrContent())
                .status(Status.PENDING)
                .build();
        applyRepository.save(application);

         // 프젝 이력 선택 -> (변경)모든 이력을 긁어서 매핑 테이블(ApplyProject)에 삽입
        List<ApplyProject> automaticMappings = new ArrayList<>();

        //ProMate 프로젝트 중 완료(COMPLETED)된 내역 전부 긁어오기
        List<Project> completedPromateProjects = memberRepository.findByUserId(userId).stream()
                .map(Member::getProject)
                .filter(project -> project.getStatus() == ProjectStatus.COMPLETED)
                .toList();

        for (Project project : completedPromateProjects) {
            automaticMappings.add(
                    ApplyProject.builder()
                            .apply(application)
                            .isManual(false)
                            .project(project)
                            .build()
            );
        }

        //유저가 직접 등록한 수동 이력(UserProjectHistory) 전부 긁어오기
        List<UserProjectHistory> manualHistories = userProjectHistoryRepository.findByUserId(userId);

        for (UserProjectHistory history : manualHistories) {
            automaticMappings.add(
                    ApplyProject.builder()
                            .apply(application)
                            .isManual(true)
                            .manualProjectId(history.getId())
                            .build()
            );
        }

        //모아진 이력 매핑 데이터를 한 번에 저장
        if (!automaticMappings.isEmpty()) {
            applyProjectRepository.saveAll(automaticMappings);
        }

        return ApplyResponse.from(application);
    }


    // 지원서 수정
    @Transactional
    public ApplicationUpdateResponse updateApplication(Long recruitmentId, Long applicationId, Long userId, ApplicationUpdateRequest request) {
        Apply apply = validateApplicationOwner(applicationId, userId);

        // 모집 중인지 체크
        validateRecruitingStatus(apply.getRecruit());

        apply.updateObjective(request.objective());
        apply.updateprContent(request.prContent());

        // 과거 프로젝트 매핑 정보 업데이트 로직 (기존 삭제 후 재등록)
        /*if(request.pastProjectIds() != null) {
            List<Project> newProjects = projectRepository.findAllById(request.pastProjectIds());
            apply.updatePastProjects(newProjects);
        }*/

        return new ApplicationUpdateResponse(apply.getId(), apply.getUpdatedAt());
    }

    // 지원서 취소 + 합격 상태였다면 추가 로직
    @Transactional
    public void deleteApplication(Long recruitmentId, Long applicationId, Long userId) {

        Apply apply = validateApplicationOwner(applicationId, userId);
        Recruit recruit = apply.getRecruit();

        if(!recruit.getId().equals(recruitmentId)){
            throw new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND);
        }

        // 모집 중인지 체크
        validateRecruitingStatus(recruit);

        // ACCEPTED 상태였다면 추가 처리
        if (apply.getStatus() == Status.ACCEPTED) {
            recruit.decreaseJoinedCount();

            // 임시 팀 멤버에서 제거
            Member member = memberRepository.findByProjectIdAndUserId(recruit.getProject().getId(), userId)
                    .orElseThrow(() -> new GeneralException(RecruitErrorCode.MEMBER_NOT_FOUND));
            memberRepository.delete(member);
            memberRepository.flush();
        }
        applyRepository.delete(apply);
    }

    // 수정,삭제에서 쓰는 공통 검증 로직
    private Apply validateApplicationOwner(Long applicationId, Long userId) {
        Apply apply = applyRepository.findByIdWithUser(applicationId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.APPLICATION_NOT_FOUND));

        if (!apply.getUser().getId().equals(userId)) {
            throw new GeneralException(RecruitErrorCode.NOT_APPLICATION_AUTHOR);
        }
        return apply;
    }

    private void validateRecruitingStatus(Recruit recruit) {
        if (recruit.getStatus() != RecruitStatus.RECRUITING) {
            throw new GeneralException(RecruitErrorCode.RECRUITMENT_ALREADY_CLOSED);
        }
    }


    // 지원서 상세 조회
    public ApplicationDetailResponse getApplicationDetail(Long recruitmentId, Long applicationId, Long leaderId) {
        // 모집글 존재 확인 및 권한 검증
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        if (!recruit.getUser().getId().equals(leaderId)) {
            throw new GeneralException(RecruitErrorCode.NOT_AUTHORIZED_LEADER);
        }

        // 지원서 조회 (Fetch Join으로 User와 ApplyProject, Project까지 가져옴)
        Apply apply = applyRepository.findByIdWithUser(applicationId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        List<ApplicationDetailResponse.PastProjectInfo> pastProjects = apply.getApplyProjects().stream()
                .map(ap -> {
                    if (!ap.isManual()) {
                        // ProMate 프로젝트 태스크 목록 조회
                        List<String> taskNames = taskRepository.findAllByProjectIdAndApplicantUserId(
                                ap.getProject().getId(), apply.getUser().getId()
                        ).stream().map(Task::getTitle).toList();

                        return new ApplicationDetailResponse.PastProjectInfo(
                                ap.getProject().getId(),
                                ap.getProject().getTitle(),
                                "PROMATE",
                                taskNames,
                                null
                        );
                    } else {
                        // 수동 입력 프로젝트 UserProjectHistory
                        UserProjectHistory userProjectHistory = userProjectHistoryRepository.findById(ap.getManualProjectId())
                                .orElseThrow(() -> new GeneralException(UserErrorCode.PROJECT_HISTORY_NOT_FOUND));

                        return new ApplicationDetailResponse.PastProjectInfo(
                                ap.getManualProjectId(),
                                userProjectHistory.getProjectName(), // title -> projectName 변경
                                "MANUAL",
                                null,
                                userProjectHistory.getDescription()  // taskDescription -> description 변경
                        );
                    }
                }).toList();


        Long applicantUserId = apply.getUser().getId();

       // 1. 상호 평가 점수 산출 (리뷰가 없으면 null이 반환되므로 기본값 0.0 처리)
        Double rawEvaluationScore = memberReviewRepository.getGlobalAverageScoreByUserId(applicantUserId);
        double peerEvaluationScore = (rawEvaluationScore != null) ? Math.round(rawEvaluationScore * 10) / 10.0 : 0.0;

       // 2. 태스크 완료율 산출 (이전 스텝 동일)
        int totalTasks = taskRepository.countTotalTasksByUserIdInCompletedProjects(applicantUserId);
        int completedTasks = taskRepository.countCompletedTasksByUserIdInCompletedProjects(applicantUserId);

        //최종 프로필 DTO 조립
        ApplicationDetailResponse.ApplicantProfile profile = new ApplicationDetailResponse.ApplicantProfile(
                apply.getUser().getName(),
                apply.getUser().getProfileImageUrl(),
                peerEvaluationScore, // 💡 매너 온도 대신 평점 쏙 대입
                totalTasks,
                completedTasks
        );

        return new ApplicationDetailResponse(
                apply.getId(),
                profile,
                apply.getPrContent(),
                apply.getObjective(),
                apply.getCreatedAt(),
                apply.getStatus(),
                pastProjects
        );
    }


    @Transactional
    public ApplyStatusResponse handleApplicationStatus(Long recruitmentId, Long applicationId, Long leaderId, ApplyStatusRequest request) {
        // 객체 조회
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        if (recruit.getStatus() != RecruitStatus.RECRUITING) {
            throw new GeneralException(RecruitErrorCode.RECRUITMENT_ALREADY_CLOSED);
        }

        Apply apply = applyRepository.findById(applicationId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.APPLICATION_NOT_FOUND));

        // 권한 검증: 팀장만 가능
        if (!recruit.getUser().getId().equals(leaderId)) {
            throw new GeneralException(RecruitErrorCode.NOT_AUTHORIZED_LEADER);
        }

        // 현재 상태와 바꾸길 원하는 상태
        Status currentStatus = apply.getStatus();
        Status targetStatus = request.status();

        if (currentStatus == targetStatus) {
            return ApplyStatusResponse.of(applicationId, targetStatus, recruit); // 조기 반환
        }

        // 바꾸려는 상태에 따른 비즈니스 로직 분기
        if (targetStatus == Status.ACCEPTED) {
            handleAccept(recruit, apply);
            //  수락 처리 직후, 현재 프로젝트에 채워진 멤버 수 확인
            int currentMemberCount = memberRepository.countByProjectId(recruit.getProject().getId());
            int maxMemberCount = recruit.getTotalSlots();

            // 목표 인원이 다 찼다면 자동으로 모집글 마감 및 프로젝트 ACTIVE 전환 프로세스 실행
            if (currentMemberCount >= maxMemberCount) {
                recruitService.processCompletion(recruit);
            }
        } else if (targetStatus == Status.REJECTED) {
            handleReject(recruit, apply, currentStatus);
        }

        return ApplyStatusResponse.of(applicationId, targetStatus, recruit);
    }

    // 합격 처리 로직
    private void handleAccept(Recruit recruit, Apply apply) {
        if (apply.getStatus() == Status.ACCEPTED) return; // 이미 합격인 경우 무시

        int current = memberRepository.countByProjectId(recruit.getProject().getId());
        if (current >= recruit.getTotalSlots()) {
            throw new GeneralException(RecruitErrorCode.RECRUITMENT_FULL);
        }

        recruit.increaseJoinedCount();

        // 임시 프로젝트에 멤버 추가
        Project project = recruit.getProject();
        Member newMember = Member.builder()
                .user(apply.getUser())
                .project(project)
                .position(Position.MEMBER)
                .build();

        memberRepository.save(newMember);
        apply.updateStatus(Status.ACCEPTED); // 상태 변경
    }

    // 불합격 및 퇴출 로직
    private void handleReject(Recruit recruit, Apply apply, Status currentStatus) {
        // CASE 1: 이미 합격된 지원자를 퇴출하는 경우
        if (currentStatus == Status.ACCEPTED) {
            recruit.decreaseJoinedCount(); // 인원 감소

            // 프로젝트 멤버 찾아서 제거 (Soft Delete 수행)
            Member member = memberRepository.findByProjectIdAndUserId(recruit.getProject().getId(), apply.getUser().getId())
                    .orElseThrow(() -> new GeneralException(RecruitErrorCode.MEMBER_NOT_FOUND));

            member.delete(); // BaseEntity의 Soft Delete 실행
        }

        // CASE 2 : 대기중인 지원자 거절, 지원서 status 변경 <- 공통 로직
        apply.updateStats(Status.REJECTED);
    }



     //대기 중인 지원자 목록 조회
    @Transactional(readOnly = true)
    public ApplicantListResponse getPendingApplicantList(Long recruitmentId, Long leaderId) {
        return getApplicantListByStatus(recruitmentId, leaderId, Status.PENDING);
    }

     //거절된 지원자 목록 조회
    @Transactional(readOnly = true)
    public ApplicantListResponse getRejectedApplicantList(Long recruitmentId, Long leaderId) {
        return getApplicantListByStatus(recruitmentId, leaderId, Status.REJECTED);
    }

    //수락된 지원자 목록 조회
    @Transactional(readOnly = true)
    public ApplicantListResponse getAcceptedApplicantList(Long recruitmentId, Long leaderId) {
        return getApplicantListByStatus(recruitmentId, leaderId, Status.ACCEPTED);
    }

    //지원서 status에 따른 리스트 조회 공통 로직 (평가 점수, 테스크 정보 전달)
    private ApplicantListResponse getApplicantListByStatus(Long recruitmentId, Long leaderId, Status status) {
        // 1. 모집글 및 팀장 권한 검증
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        if (!recruit.getUser().getId().equals(leaderId)) {
            throw new GeneralException(RecruitErrorCode.NOT_AUTHORIZED_LEADER);
        }

        // 2. Fetch Join으로 해당 상태의 지원서 일괄 조회
        List<Apply> applies = applyRepository.findAllByRecruitIdAndStatusWithUser(recruitmentId, status);

        // 3. N+1 방지용 지원자 유저 ID 목록 추출
        List<Long> userIds = applies.stream().map(a -> a.getUser().getId()).toList();

        Map<Long, Double> scoreMap = new HashMap<>();
        Map<Long, Integer> totalTaskMap = new HashMap<>();
        Map<Long, Integer> completedTaskMap = new HashMap<>();

        // 4. 지원자가 존재할 때만 대량 쿼리 수행
        if (!userIds.isEmpty()) {
            // 4-A. 상호 평가 점수 맵 매핑
            scoreMap = memberReviewRepository.findAverageScoresByUserIds(userIds).stream()
                    .collect(Collectors.toMap(obj -> (Long) obj[0], obj -> Math.round((Double) obj[1] * 10) / 10.0));

            // 4-B. 총 태스크 수 맵 매핑 (Long을 Integer로 안전하게 다운캐스팅)
            totalTaskMap = taskRepository.countTotalTasksByUserIdsInCompletedProjects(userIds).stream()
                    .collect(Collectors.toMap(obj -> (Long) obj[0], obj -> ((Long) obj[1]).intValue()));

            // 4-C. 완료한 태스크 수 맵 매핑
            completedTaskMap = taskRepository.countCompletedTasksByUserIdsInCompletedProjects(userIds).stream()
                    .collect(Collectors.toMap(obj -> (Long) obj[0], obj -> ((Long) obj[1]).intValue()));
        }

        // 5. 최종 데이터 맵 매핑 및 DTO 조립
        Map<Long, Double> finalScoreMap = scoreMap;
        Map<Long, Integer> finalTotalTaskMap = totalTaskMap;
        Map<Long, Integer> finalCompletedTaskMap = completedTaskMap;

        List<ApplicantListResponse.ApplicantSummary> summaries = applies.stream()
                .map(a -> {
                    Long userId = a.getUser().getId();

                    double peerScore = finalScoreMap.getOrDefault(userId, 0.0);
                    int totalTasks = finalTotalTaskMap.getOrDefault(userId, 0);
                    int completedTasks = finalCompletedTaskMap.getOrDefault(userId, 0);

                    return new ApplicantListResponse.ApplicantSummary(
                            a.getId(),
                            userId,
                            a.getUser().getName(),
                            peerScore,
                            totalTasks,
                            completedTasks,
                            a.getCreatedAt(),
                            a.getStatus()
                    );
                }).toList();

        return new ApplicantListResponse(recruit.getId(), recruit.getTitle(), summaries.size(), summaries);
    }
}


