package org.example.promate.domain.review.repository;

import org.example.promate.domain.review.entity.MemberReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberReviewRepository extends JpaRepository<MemberReview, Long> {

    boolean existsByProjectIdAndReviewerId(Long projectId, Long reviewerId);

    List<MemberReview> findByProjectIdAndRevieweeId(Long projectId, Long revieweeId);

    List<MemberReview> findByRevieweeId(Long revieweeId);
}