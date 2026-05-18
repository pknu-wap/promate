package org.example.promate.domain.review.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class MemberReviewDetailResponseDTO {

    private double averageScore;
    private int reviewCount;
    private List<ReviewDetail> reviews;

    @Getter
    @AllArgsConstructor
    public static class ReviewDetail {

        private int communicationScore;
        private int proactivenessScore;
        private int responsibilityScore;
        private int problemSolvingScore;
        private double averageScore;
        private String comment;
        private LocalDateTime createdAt;
    }
}