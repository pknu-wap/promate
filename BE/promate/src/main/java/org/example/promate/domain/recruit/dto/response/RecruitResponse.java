package org.example.promate.domain.recruit.dto.response;

import org.example.promate.domain.apply.enums.Status;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.enums.Category;
import org.example.promate.domain.recruit.enums.RecruitStatus;

import java.time.LocalDateTime;

public record RecruitResponse(
        Long recruitmentId,
        String title,
        String description,     // 추가 <- 북마크된 모집글용
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
    public static RecruitResponse of(Recruit recruit, Status myApplyStatus, Long myApplicationId, Long userId) {

        Long targetProjectId = null;

        // 1. 현재 유저가 이 모집글을 쓴 팀장(Leader)이거나
        // 2. 지원 상태가 최종 수락(ACCEPTED)된 합격자인 경우
        boolean isLeader = recruit.getUser() != null && recruit.getUser().getId().equals(userId);
        boolean isAccepted = (myApplyStatus == Status.ACCEPTED);

        // 둘 중 하나라도 해당하고, 프로젝트가 존재할 때만 ID를 열어줍니다.
        if ((isLeader || isAccepted) && recruit.getProject() != null) {
            targetProjectId = recruit.getProject().getId();
        }

        return new RecruitResponse(
                recruit.getId(),
                recruit.getTitle(),
                recruit.getDescription(),
                recruit.getCategory(),
                recruit.getCreatedAt(),
                recruit.getDeadline(),
                recruit.getStatus(),
                recruit.getTotalSlots(),
                recruit.getJoinedCount(),
                // Project 엔티티 연관관계가 있다면 ID 추출, 없으면 null
                targetProjectId,
                myApplyStatus,
                myApplicationId
        );
    }
}