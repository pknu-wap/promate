package org.example.promate.domain.apply.dto;

import jakarta.validation.constraints.NotBlank;

public record ApplicationUpdateRequest(
        @NotBlank String objective,
        @NotBlank String prContent
) {}