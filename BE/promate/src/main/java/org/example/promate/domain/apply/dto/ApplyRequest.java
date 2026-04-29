package org.example.promate.domain.apply.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ApplyRequest(
        @NotBlank String preferredRole,
        @NotBlank String introduction,
        List<Long> selectedProjectIds
) {}
