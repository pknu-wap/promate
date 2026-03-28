package org.example.promate.domain.recruit.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.promate.domain.recruit.enums.RecruitStatus;

public record RecruitUpdateRequest(
        @NotBlank(message = "제목은 비워둘 수 없습니다.")
        String title,
        @NotBlank(message = "내용은 비워둘 수 없습니다.")
        String content,
        @NotNull(message = "상태값은 필수입니다.")
        RecruitStatus status
){}
