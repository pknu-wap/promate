package org.example.promate.domain.user.dto;

import lombok.Builder;
import lombok.Getter;
import org.example.promate.domain.user.entity.UserProjectHistory;

@Getter
@Builder
public class UserProjectHistoryResponseDTO {

    private Long historyId;
    private String projectName;
    private String role;
    private String period;
    private String description;
    private Boolean editable;

    public static UserProjectHistoryResponseDTO from(UserProjectHistory history) {
        return UserProjectHistoryResponseDTO.builder()
                .historyId(history.getId())
                .projectName(history.getProjectName())
                .role(history.getRole())
                .period(history.getPeriod())
                .description(history.getDescription())
                .editable(true)
                .build();
    }
}