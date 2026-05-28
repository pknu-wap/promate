package org.example.promate.domain.apply.dto;

import org.example.promate.domain.apply.enums.Status;
import java.time.LocalDateTime;
import java.util.List;

public record ApplicationDetailResponse(
        Long applicationId,
        ApplicantProfile applicant,
        String introduction,
        String contributionArea,
        LocalDateTime appliedAt,
        Status status,
        List<PastProjectInfo> pastProjects
) {
    public record ApplicantProfile(
            String name,
            String profileImageUrl,
            double peerEvaluationScore,
            int totalTasks,
            int completedTasks
    ) {}

    public record PastProjectInfo(
            Long projectId,
            String title,
            String type, //프로젝트 이력 구분을 위함
            List<String> taskNames,
            String selfTaskDescription
    ) {} //ProMate 프로젝트 -> taskNames 입력, selfTaskDescription NULL
    // 수동 입력 프로젝트 -> taskNames NULL , selfTaskDescription 입력
}
