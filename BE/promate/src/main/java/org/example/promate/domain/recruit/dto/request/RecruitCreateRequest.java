package org.example.promate.domain.recruit.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.example.promate.domain.recruit.enums.Category;
import java.time.LocalDate;

public record RecruitCreateRequest(
        @NotNull(message = "제목을 입력하세요")
        String title,
        @NotNull(message = "내용을 입력하세요")
        String description,
        @NotNull(message = "카테고리를 선택해주세요.")
        Category category,
        @Min(value = 1, message = "최소 1명 이상이어야 합니다")
        int totalSlots,
        @NotNull(message = "프로젝트 시작일을 선택하세요")
        LocalDate startDate,
        @NotNull(message = "프로젝트 마감일을 선택하세요")
        LocalDate endDate
){}
