package org.example.promate.domain.apply.dto;

import org.example.promate.domain.apply.enums.Status;
import org.example.promate.domain.recruit.entity.Recruit;

public record ApplyStatusResponse(
        Long applicationId,
        Status status,
        int currentParticipants,
        int maxParticipants
) {
    public static ApplyStatusResponse of(Long applicationId, Status status, Recruit recruit) {
        return new ApplyStatusResponse(
                applicationId,
                status,
                recruit.getJoinedCount(),
                recruit.getTotalSlots()
        );
    }
}