package org.example.promate.domain.user.dto;

import lombok.Getter;

@Getter
public class UserProjectHistoryRequestDTO {

    private String projectName;
    private String role;
    private String period;
    private String description;
}