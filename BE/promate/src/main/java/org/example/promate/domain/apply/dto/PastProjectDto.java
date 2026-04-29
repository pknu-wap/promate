package org.example.promate.domain.apply.dto;

import org.example.promate.domain.recruit.enums.Category;

public record PastProjectDto(
        Long projectId,
        String title,
        Category category
) {}