package org.example.promate.domain.apply.dto;

import org.example.promate.domain.apply.enums.Status;
import org.example.promate.domain.recruit.enums.Category;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ApplicationDetailResponse(
        Long applicationId,
        ApplicantProfile applicant,
        String introduction,
        LocalDateTime appliedAt,
        Status status,
        List<PastProjectInfo> pastProjects
) {
    public record ApplicantProfile(
            String name,
            BigDecimal mannerTemperature,
            BigDecimal sincerityTemperature,
            String profileImageUrl
    ) {}

    public record PastProjectInfo(
            Long projectId,
            String title,
            Category category
    ) {}
}
