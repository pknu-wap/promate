package org.example.promate.domain.recruit.dto.request;

import jakarta.validation.constraints.NotNull;
import org.example.promate.domain.recruit.enums.RecruitStatus;

public record RecruitStatusRequest(
        @NotNull RecruitStatus status // COMPLETED 전달
) {}
