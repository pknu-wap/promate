package org.example.promate.domain.recruit.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RecruitUpdateRequest(
        @NotBlank(message = "제목은 비워둘 수 없습니다.")
        String title,
        @NotBlank(message = "내용은 비워둘 수 없습니다.")
        String content
){}
