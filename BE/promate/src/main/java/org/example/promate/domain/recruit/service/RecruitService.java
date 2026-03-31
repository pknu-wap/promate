package org.example.promate.domain.recruit.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.recruit.dto.request.RecruitCreateRequest;
import org.example.promate.domain.recruit.dto.request.RecruitUpdateRequest;
import org.example.promate.domain.recruit.dto.response.RecruitCreateResponse;
import org.example.promate.domain.recruit.dto.response.RecruitDetailResponse;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.repository.RecruitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecruitService {
    private final RecruitRepository recruitRepository;
    //private final UserRepository userRepository;
    //private final ApplicationRepository applicationRepository; // 지원 내역 확인용

    @Transactional
    public RecruitCreateResponse createRecruitment(
            RecruitCreateRequest request, Long userId)
    {
        // User writer = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));
        Recruit recruit = Recruit.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .totalSlots(request.totalSlots())
                .deadline(request.deadline())
                //.user(writer)
                .build();

        Recruit savedRecruit = recruitRepository.save(recruit);

        return new RecruitCreateResponse(savedRecruit.getId());
    }

    public RecruitDetailResponse getRecruitmentDetail(Long recruitmentId, Long currentUserId) {
        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        boolean isAuthor = recruit.getUser().getId().equals(currentUserId);
        //지원 여부 및 지원자 수 계산 (Application 만들고 도입)
        // boolean hasApplied = applicationRepository.existsByRecruitIdAndUserId(recruitmentId, currentUserId);
        // int applicantCount = applicationRepository.countByRecruitId(recruitmentId);

        // 임시 하드코딩 (아직 Application 도메인이 없으므로)
        boolean hasApplied = false;
        int applicantCount = 5;

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
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        if (!recruit.getUser().getId().equals(userId)) {
            throw new SecurityException("수정 권한이 없습니다.");
        }

        recruit.update(request.title(), request.content(), request.status());
    }

    @Transactional
    public void deleteRecruitment(Long recruitmentId, Long userId) {

        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        if (!recruit.getUser().getId().equals(userId)) {
            throw new SecurityException("삭제 권한이 없습니다.");
        }

        recruit.delete();
    }
}
