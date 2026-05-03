package org.example.promate.domain.apply.repository;

import org.example.promate.domain.apply.entity.Apply;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplyRepository extends JpaRepository<Apply, Long> {

    // 특정 사용자가 특정 모집글에 이미 지원했는지 여부 확인 (모집 게시글 컨트롤러에서 사용)
    boolean existsByRecruitIdAndUserId(Long recruitId, Long userId);

    // 특정 모집글에 지원한 총 지원자 수 계산 (모집 게시글 컨트롤러에서 사용)
    int countByRecruitId(Long recruitId);

    // 특정 모집글 중복 지원 방지
    boolean existsByRecruitIdAndUserIdAndIsDeletedFalse(Long recruitId, Long userId);
}
