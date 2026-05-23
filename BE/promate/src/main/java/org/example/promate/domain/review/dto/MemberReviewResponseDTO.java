package org.example.promate.domain.review.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberReviewResponseDTO {

    private int submittedCount;

    @Getter
    @AllArgsConstructor
    public static class ReviewTarget {
        private Long revieweeId;
        private String name;
    }
}