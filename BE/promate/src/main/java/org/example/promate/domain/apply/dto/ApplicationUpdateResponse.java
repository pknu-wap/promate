package org.example.promate.domain.apply.dto;

import java.time.LocalDateTime;

public record ApplicationUpdateResponse(
        Long applicationId,
        LocalDateTime updatedAt
) {}
