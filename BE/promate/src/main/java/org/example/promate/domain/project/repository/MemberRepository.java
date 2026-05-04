package org.example.promate.domain.project.repository;

import org.example.promate.domain.project.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {
    Optional<Member> findByProjectIdAndUserId(Long projectId, Long userId);
    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    Optional<Member> findByIdAndProjectId(Long userId,Long projectId);
    Optional<Member> findByUserIdAndProjectId(Long userId,Long projectId);
}
