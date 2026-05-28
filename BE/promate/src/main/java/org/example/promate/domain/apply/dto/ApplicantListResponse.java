package org.example.promate.domain.apply.dto;

import org.example.promate.domain.apply.enums.Status;
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
            double peerEvaluationScore,
            int totalTasks,
            int completedTasks,
            LocalDateTime appliedAt,
            Status status
    ) {}
}