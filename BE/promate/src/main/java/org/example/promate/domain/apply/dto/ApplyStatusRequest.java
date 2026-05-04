package org.example.promate.domain.apply.dto;

import jakarta.validation.constraints.NotNull;
import org.example.promate.domain.apply.enums.Status;

public record ApplyStatusRequest(
        @NotNull Status status
) {}

