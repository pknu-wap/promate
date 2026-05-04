package org.example.promate.domain.apply.dto;

import org.example.promate.domain.apply.enums.Status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ApplicantListResponse(
        Long recruitmentId,
        String title,
        int totalApplicantCount,
        List<ApplicantSummary> applicants
) {
    public record ApplicantSummary(
            Long applicationId,
            Long applicantId,
            String name,
            BigDecimal mannerTemp,
            BigDecimal diligenceTemp,
            LocalDateTime appliedAt,
            Status status
    ) {}
}