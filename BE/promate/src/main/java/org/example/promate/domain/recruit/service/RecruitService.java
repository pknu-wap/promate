package org.example.promate.domain.recruit.service;

import lombok.RequiredArgsConstructor;
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
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.enums.RecruitStatus;
import org.example.promate.domain.recruit.repository.RecruitRepository;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.exception.UserErrorCode;
import org.example.promate.domain.user.repository.UserRepository;
import org.example.promate.global.ApiPayload.code.RecruitErrorCode;
import org.example.promate.global.ApiPayload.exception.GeneralException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecruitService {

    private final RecruitRepository recruitRepository;
    private final UserRepository userRepository;
    private final ApplyRepository applyRepository; // 지원 내역 확인용
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;

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
                .deadline(request.deadline())
                .user(writer)
                .build();

        // 임시 Project 객체 생성 (팀장이 팀 결정 OR 팀 빌딩 취소 결정)
        Project project = Project.builder()
                .title(request.title()) // 일단 모집글 제목을 프로젝트명으로 사용
                .description(request.description())
                .status(ProjectStatus.PREPARING) // 아직 시작 전 상태
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

        return new RecruitDetailResponse(
                recruit.getId(),
                recruit.getTitle(),
                recruit.getDescription(),
                recruit.getCategory(),
                "RECRUITING", // 임시 상태값
                recruit.getCreatedAt(),
                recruit.getUpdatedAt(),
                recruit.getDeadline(),
                new RecruitDetailResponse.AuthorDto(
                        recruit.getUser().getId(),
                        recruit.getUser().getName(),
                        recruit.getUser().getProfileImageUrl()
                ),
                isAuthor,
                hasApplied,
                applicantCount
        );
    }

    @Transactional
    public void updateRecruitment(Long recruitmentId, RecruitUpdateRequest request, Long userId) {

        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        if (!recruit.getUser().getId().equals(userId)) {
            throw new SecurityException("수정 권한이 없습니다.");
        }

        recruit.update(request.title(), request.content(), request.status());
    }

    @Transactional
    public void deleteRecruitment(Long recruitmentId, Long userId) {

        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new GeneralException(RecruitErrorCode.RECRUITMENT_NOT_FOUND));

        if (!recruit.getUser().getId().equals(userId)) {
            throw new GeneralException(RecruitErrorCode.NOT_RECRUITMENT_AUTHOR);
        }

        // 부모인 Recruit만 삭제하면 Project와 그 안의 Member들까지 DB에서 연쇄 삭제됨
        recruit.delete();
    }

    public RecruitPageResponse<RecruitResponse> getRecruitments(RecruitSearchCondition condition, Pageable pageable) {

        Page<RecruitResponse> resultPage = recruitRepository.searchRecruits(condition, pageable);

        return RecruitPageResponse.of(resultPage);
    }



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

    private RecruitStatusResponse processCompletion(Recruit recruit) {
        // 임시 프로젝트 상태 변경 (PREPARING -> ACTIVE)
        Project project = recruit.getProject();
        if (project == null) {
            throw new GeneralException(RecruitErrorCode.PROJECT_NOT_FOUND);
        }
        project.updateStatus(ProjectStatus.ACTIVE);

        // 모집글 + 지원서 데이터 청소 (일단 Hard Delete를 채택함) <- 추후 개발 진도에 따라 수정 고려
        // 두 객체 간 매핑 관계 부터 해제하기
        project.disconnectRecruit();

        // 해당 모집글에 연결된 모든 지원서 삭제
        applyRepository.deleteAllByRecruitId(recruit.getId());

        // 모집글 삭제
        recruitRepository.delete(recruit);

        return new RecruitStatusResponse(project.getId(), RecruitStatus.COMPLETED);
    }
}
