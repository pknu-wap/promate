package org.example.promate.domain.apply.dto;
import java.util.List;

public record ApplyFormResponse(
        String recruitmentTitle,
        List<PastProjectDto> myPastProjects
) {
    public static ApplyFormResponse of(String title, List<PastProjectDto> projects) {
        return new ApplyFormResponse(title, projects);
    }
}


