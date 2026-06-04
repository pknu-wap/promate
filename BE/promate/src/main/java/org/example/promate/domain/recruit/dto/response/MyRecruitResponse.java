package org.example.promate.domain.recruit.dto.response;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.enums.Category;
import org.example.promate.domain.recruit.enums.RecruitStatus;

import java.time.LocalDateTime;

public record MyRecruitResponse(
        Long postId,
        String title,
        Category category,
        LocalDateTime createdAt,
        RecruitStatus status,
        int currentMember,
        int maxMember,
        boolean isBookmarked
) {
    public static MyRecruitResponse from(Recruit recruit, boolean isBookmarked) {
        return new MyRecruitResponse(
                recruit.getId(),
                recruit.getTitle(),
                recruit.getCategory(),
                recruit.getCreatedAt(),
                recruit.getStatus(),
                recruit.getJoinedCount(),
                recruit.getTotalSlots(),
                isBookmarked
        );
    }
}
