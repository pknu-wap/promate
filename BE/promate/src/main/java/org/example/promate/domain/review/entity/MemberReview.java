package org.example.promate.domain.review.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.promate.global.entity.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberReview extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;

    // 평가한 사람 id
    private Long reviewerId;

    // 평가받은 사람 id
    private Long revieweeId;

    // 소통 능력
    private int communicationScore;

    // 적극성
    private int proactivenessScore;

    // 책임감
    private int responsibilityScore;

    // 문제 해결 능력
    private int problemSolvingScore;

    // 추가 의견 (선택적)
    private String comment;

    @Builder
    public MemberReview(
            Long projectId,
            Long reviewerId,
            Long revieweeId,
            int communicationScore,
            int proactivenessScore,
            int responsibilityScore,
            int problemSolvingScore,
            String comment
    ) {
        this.projectId = projectId;
        this.reviewerId = reviewerId;
        this.revieweeId = revieweeId;
        this.communicationScore = communicationScore;
        this.proactivenessScore = proactivenessScore;
        this.responsibilityScore = responsibilityScore;
        this.problemSolvingScore = problemSolvingScore;
        this.comment = comment;
    }
}