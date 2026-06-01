package org.example.promate.domain.recruit.dto.response;

import lombok.Builder;
import lombok.Getter;
import org.example.promate.domain.project.enums.ProjectStatus;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class RecruitLeaderProfileResponse {

    private Long leaderId;
    private String leaderName;
    private String profileImageUrl;

    private Double averageReviewScore;
    private Long reviewCount;

    private Integer completedTaskCount;
    private Integer incompleteTaskCount;

    private List<ProjectHistoryDTO> projects;

    @Getter
    @Builder
    public static class ProjectHistoryDTO {
        private Long projectId;
        private String projectTitle;
        private String role;
        private String position;
        private ProjectStatus projectStatus;
        private LocalDate startDate;
        private LocalDate endDate;

        private Double averageReviewScore;
        private Long reviewCount;

        private Integer completedTaskCount;
        private Integer incompleteTaskCount;
    }
}