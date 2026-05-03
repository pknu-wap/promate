package org.example.promate.domain.recruit.dto.response;

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
        int currentMember
) {}