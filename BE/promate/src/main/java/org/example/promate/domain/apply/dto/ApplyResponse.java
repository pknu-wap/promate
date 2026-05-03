package org.example.promate.domain.apply.dto;

import org.example.promate.domain.apply.entity.Apply;
import org.example.promate.domain.apply.enums.Status;

import java.time.LocalDateTime;

public record ApplyResponse(
        Long applicationId,
        Status status,
        LocalDateTime appliedAt
) {
    public static ApplyResponse from(Apply application) {
        return new ApplyResponse(
                application.getId(),
                application.getStatus(),
                application.getCreatedAt()
        );
    }
}
