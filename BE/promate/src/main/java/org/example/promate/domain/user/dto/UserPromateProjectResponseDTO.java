package org.example.promate.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserPromateProjectResponseDTO {

    private Long projectId;
    private String projectName;
    private String role;
    private String period;
    private Boolean editable;
}