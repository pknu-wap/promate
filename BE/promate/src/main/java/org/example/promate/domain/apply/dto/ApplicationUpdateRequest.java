package org.example.promate.domain.apply.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ApplicationUpdateRequest(
        @NotBlank String objective,
        @NotBlank String prContent,
        List<Long> pastProjectIds
) {}