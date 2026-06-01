package org.example.promate.domain.recruit.dto.response;

import lombok.Builder;
import org.example.promate.domain.recruit.enums.Category;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record RecruitDetailResponse(
        Long postId,
        String title,
        String content,
        Category category,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        AuthorDto author,
        boolean isAuthor,
        boolean hasApplied,
        int applicantCount,

        LocalDate startDate,    // 프로젝트 시작일
        LocalDate endDate,      // 프로젝트 마감일
        int totalSlots,         // 총 모집 인원
        int joinedCount
) {
    //모집글(부모) - 작성자(자식) 상속관계 표현
    public record AuthorDto(
            Long memberId,
            String nickname,
            String profileImageUrl
    ) {}
}