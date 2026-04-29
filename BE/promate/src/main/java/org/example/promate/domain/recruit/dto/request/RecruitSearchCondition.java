package org.example.promate.domain.recruit.dto.request;
import org.example.promate.domain.recruit.enums.Category;

public record RecruitSearchCondition (
    String search,
    Category category
){}
