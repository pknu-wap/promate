package org.example.promate.domain.recruit.dto.response;

import org.example.promate.domain.apply.enums.Status;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.enums.Category;
import org.example.promate.domain.recruit.enums.RecruitStatus;

import java.time.LocalDateTime;

public record RecruitResponse(
        Long recruitmentId,
        String title,
        Category category,
        LocalDateTime createdAt,
        LocalDateTime deadline,
        RecruitStatus status,
        int maxMember,
        int currentMember,
        Long projectId,         // 모집글을 통해 개설된 프로젝트 ID (개설 전이면 null)
        Status myApplyStatus,   // 본인의 지원 상태 (PENDING, ACCEPTED, REJECTED / 지원 안 했으면 null)
        Long myApplicationId    // 본인의 지원서 ID (지원 안 했으면 null)
) {
    public static RecruitResponse of(Recruit recruit, Status myApplyStatus, Long myApplicationId) {
        return new RecruitResponse(
                recruit.getId(),
                recruit.getTitle(),
                recruit.getCategory(),
                recruit.getCreatedAt(),
                recruit.getDeadline(),
                recruit.getStatus(),
                recruit.getTotalSlots(),
                recruit.getJoinedCount(),
                // Project 엔티티 연관관계가 있다면 ID 추출, 없으면 null
                recruit.getProject() != null ? recruit.getProject().getId() : null,
                myApplyStatus,
                myApplicationId
        );
    }
}