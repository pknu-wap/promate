package org.example.promate.domain.review.repository;

import org.example.promate.domain.review.entity.MemberReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberReviewRepository extends JpaRepository<MemberReview, Long> {

    boolean existsByProjectIdAndReviewerId(Long projectId, Long reviewerId);

    List<MemberReview> findByProjectIdAndRevieweeId(Long projectId, Long revieweeId);

    List<MemberReview> findByRevieweeId(Long revieweeId);


    // 지원자의 모든 프로젝트 리뷰 평점의 평균 구하기
    @Query("SELECT AVG((r.communicationScore + r.proactivenessScore + r.responsibilityScore + r.problemSolvingScore) / 4.0) " +
            "FROM MemberReview r WHERE r.revieweeId = :userId")
    Double getGlobalAverageScoreByUserId(@Param("userId") Long userId);

    // 지원자들의 ID 리스트를 받아 한 번에 평균 점수들을 맵핑할 데이터 긁어오기
    @Query("SELECT r.revieweeId, AVG((r.communicationScore + r.proactivenessScore + r.responsibilityScore + r.problemSolvingScore) / 4.0) " +
            "FROM MemberReview r WHERE r.revieweeId IN :userIds GROUP BY r.revieweeId")
    List<Object[]> findAverageScoresByUserIds(@Param("userIds") List<Long> userIds);
}