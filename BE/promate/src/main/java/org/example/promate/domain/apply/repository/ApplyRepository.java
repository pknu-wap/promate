package org.example.promate.domain.apply.repository;

import org.example.promate.domain.apply.entity.Apply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplyRepository extends JpaRepository<Apply, Long> {

    // 특정 사용자가 특정 모집글에 이미 지원했는지 여부 확인 (모집 게시글 컨트롤러에서 사용)
    boolean existsByRecruitIdAndUserId(Long recruitId, Long userId);

    // 특정 모집글에 지원한 총 지원자 수 계산 (모집 게시글 컨트롤러에서 사용)
    int countByRecruitId(Long recruitId);

    // 특정 모집글 중복 지원 방지
    boolean existsByRecruitIdAndUserIdAndIsDeletedFalse(Long recruitId, Long userId);

    @Query("select a from Apply a join fetch a.user where a.recruit.id = :recruitId")
    List<Apply> findAllByRecruitIdWithUser(@Param("recruitId") Long recruitId);

    //left join을 통해서 프로젝트 이력이 없는 최초 사용자에 대해서 이력이 없어도 테이블 내용을 살림
    @Query("select a from Apply a " +
            "join fetch a.user " +
            "left join fetch a.applyProjects ap " +
            "left join fetch ap.project " +
            "where a.id = :applicationId")
    Optional<Apply> findByIdWithUserAndProjects(@Param("applicationId") Long applicationId);


    void deleteAllByRecruitId(Long id);

    List<Apply> findByUserId(Long userId);
}
