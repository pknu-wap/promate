package org.example.promate.domain.project.repository;

import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {
    Optional<Member> findByProjectIdAndUserId(Long projectId, Long userId);
    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    Optional<Member> findByIdAndProjectId(Long userId,Long projectId);
    Optional<Member> findByUserIdAndProjectId(Long userId,Long projectId);

    // 특정 사용자의 프로젝트 목록 조회 (N+1 문제 방지)
    @Query("select m from Member m join fetch m.project where m.user.id = :userId and m.project.status = :status")
    List<Member> findByUserIdAndProjectStatus(
            @Param("userId") Long userId,
            @Param("status") ProjectStatus status
    );
}
