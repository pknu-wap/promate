package org.example.promate.domain.project.repository;

import org.example.promate.domain.project.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {
    @Query("select m from Member m " +
            "join fetch m.project " +
            "where m.project.id = :projectId " +
            "and m.user.id = :userId")
    Optional<Member> findMemberWithProject(@Param("projectId") Long projectId, @Param("userId") Long userId);

    Optional<Member> findByProjectIdAndUserId(Long projectId, Long userId);
    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    Optional<Member> findByIdAndProjectId(Long id,Long projectId);
    Optional<Member> findByUserIdAndProjectId(Long userId,Long projectId);
}
