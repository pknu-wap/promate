package org.example.promate.domain.recruit.dto.response;

import org.example.promate.domain.recruit.enums.RecruitStatus;

public record RecruitStatusResponse(
        Long projectId,
        RecruitStatus status
) {}
