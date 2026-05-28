package org.example.promate.domain.user.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class UserProjectHistoryRequestDTO {

    private String projectName;
    private String role;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
}