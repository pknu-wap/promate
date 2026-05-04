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
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.project.repository.ProjectRepository;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.enums.RecruitStatus;
import org.example.promate.domain.recruit.repository.RecruitRepository;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.repository.UserRepository;
import org.example.promate.domain.recruit.code.RecruitErrorCode;
import org.example.promate.global.ApiPayload.exception.GeneralException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


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

    public ApplyFormResponse getApplyForm(Long recruitmentId, Long userId) {
        // 모집글 제목을 위한 조회 (Soft Delete 고려)
        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        validateRecruitingStatus(recruit);

        // 사용자의 과거 완료된 프로젝트 목록 조회
        // ProMate에서 완료된 프로젝트(Category, Title) 정보를 DTO 형식으로 바로 리스트화
        List<PastProjectDto> pastProjects = projectRepository.findCompletedProjectsByUserId(userId);

        return ApplyFormResponse.of(recruit.getTitle(), pastProjects);
    }


    public ApplyResponse submit(Long recruitmentId, Long userId, ApplyRequest request) {

        // 중복 지원 방지 검증
        if (applyRepository.existsByRecruitIdAndUserIdAndIsDeletedFalse(recruitmentId, userId)) {
            throw new GeneralException(RecruitErrorCode.ALREADY_APPLIED);
        }

        // 연관 엔티티 조회
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() ->new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        validateRecruitingStatus(recruit);

        User user = userRepository.findById(userId).get();

        // 지원서 Status가 PENDING 아닌 상태라면 지원 차단
        if (recruit.getStatus() != RecruitStatus.RECRUITING) {
            throw new GeneralException(RecruitErrorCode.RECRUITMENT_ALREADY_CLOSED);
        }

        // 지원서 생성 및 저장
        Apply application = Apply.builder()
                .user(user)
                .recruit(recruit)
                .objective(request.preferredRole())
                .prContent(request.introduction())
                .status(Status.PENDING)
                .build();
        applyRepository.save(application);

        // 선택한 프로젝트 이력 매핑 저장
        if (request.selectedProjectIds() != null && !request.selectedProjectIds().isEmpty()) {
            List<Project> projects = projectRepository.findAllById(request.selectedProjectIds());

            List<ApplyProject> mappings = projects.stream()
                    .map(p -> new ApplyProject(application, p))
                    .toList();
            applyProjectRepository.saveAll(mappings);
        }

        return ApplyResponse.from(application);
    }


    // 지원서 수정
    public ApplicationUpdateResponse updateApplication(Long recruitmentId, Long applicationId, Long userId, ApplicationUpdateRequest request) {
        Apply apply = validateApplicationOwner(applicationId, userId);

        // 모집 중인지 체크
        validateRecruitingStatus(apply.getRecruit());

        apply.updateprContent(request.prContent());

        // 과거 프로젝트 매핑 정보 업데이트 로직 (기존 삭제 후 재등록)
        List<Project> newProjects = projectRepository.findAllById(request.pastProjectIds());
        apply.updatePastProjects(newProjects);

        return new ApplicationUpdateResponse(apply.getId(), apply.getUpdatedAt());
    }

    // 지원서 취소 + 합격 상태였다면 추가 로직
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
            member.delete();
            memberRepository.delete(member);
        }
        apply.delete();
        applyRepository.delete(apply);
    }

    // 수정,삭제에서 쓰는 공통 검증 로직
    private Apply validateApplicationOwner(Long applicationId, Long userId) {
        Apply apply = applyRepository.findById(applicationId)
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


    // 지원자 목록 조회
    public ApplicantListResponse getApplicantList(Long recruitmentId, Long leaderId) {
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        // 권한 검증 팀장만 가능
        if (!recruit.getUser().getId().equals(leaderId)) {
            throw new GeneralException(RecruitErrorCode.NOT_AUTHORIZED_LEADER);
        }

        // Apply 엔티티와 User를 Fetch Join으로 가져오기
        List<Apply> applies = applyRepository.findAllByRecruitIdWithUser(recruitmentId);

        List<ApplicantListResponse.ApplicantSummary> summaries = applies.stream()
                .map(a -> new ApplicantListResponse.ApplicantSummary(
                        a.getId(),
                        a.getUser().getId(),
                        a.getUser().getName(),
                        a.getUser().getMannerTemp(),
                        a.getUser().getDiligenceTemp(),
                        a.getCreatedAt(),
                        a.getStatus()
                )).toList();

        return new ApplicantListResponse(recruit.getId(), recruit.getTitle(), summaries.size(), summaries);
    }

    // 2. 지원서 상세 조회
    public ApplicationDetailResponse getApplicationDetail(Long recruitmentId, Long applicationId, Long leaderId) {
        // 모집글 존재 확인 및 권한 검증
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        if (!recruit.getUser().getId().equals(leaderId)) {
            throw new GeneralException(RecruitErrorCode.NOT_AUTHORIZED_LEADER);
        }

        // 지원서 조회 (Fetch Join으로 User와 ApplyProject, Project까지 가져옴)
        Apply apply = applyRepository.findByIdWithUserAndProjects(applicationId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        // DTO 변환
        ApplicationDetailResponse.ApplicantProfile profile = new ApplicationDetailResponse.ApplicantProfile(
                apply.getUser().getName(),
                apply.getUser().getMannerTemp(),
                apply.getUser().getDiligenceTemp(),
                apply.getUser().getProfileImageUrl()
        );

        List<ApplicationDetailResponse.PastProjectInfo> pastProjects = apply.getApplyProjects().stream()
                .map(ap -> new ApplicationDetailResponse.PastProjectInfo(
                        ap.getProject().getId(),
                        ap.getProject().getTitle(),
                        recruit.getCategory()
                )).toList();

        return new ApplicationDetailResponse(
                apply.getId(),
                profile,
                apply.getPrContent(),
                apply.getCreatedAt(),
                apply.getStatus(),
                pastProjects
        );
    }


    public ApplyStatusResponse handleApplicationStatus(Long recruitmentId, Long applicationId, Long leaderId, ApplyStatusRequest request) {
        // 객체 조회
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        // 지원서 Status가 PENDING 아닌 상태라면 차단
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

        // 바꾸려는 상태에 따른 비즈니스 로직 분기
        if (targetStatus == Status.ACCEPTED) {
            handleAccept(recruit, apply);
        } else if (targetStatus == Status.REJECTED) {
            handleReject(recruit, apply, currentStatus);
        }

        return ApplyStatusResponse.of(applicationId, targetStatus, recruit);
    }

    // 합격 처리 로직
    private void handleAccept(Recruit recruit, Apply apply) {
        if (apply.getStatus() == Status.ACCEPTED) return; // 이미 합격인 경우 무시

        // 정원 체크 및 인원 증가
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
            memberRepository.delete(member);
        }

        // CASE 2 : 지원서 불합격 처리
        applyRepository.delete(apply); // 공통 로직 : 지원서 삭제
    }
}
