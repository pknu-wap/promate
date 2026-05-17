package org.example.promate.domain.review.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class MemberReviewRequestDTO {

    private List<ReviewItem> reviews;


    @Getter
    @NoArgsConstructor
    public static class ReviewItem {

        private Long revieweeId;

        private int communicationScore;

        private int proactivenessScore;

        private int responsibilityScore;

        private int problemSolvingScore;

        private String comment;
    }
}