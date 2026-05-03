package org.example.promate.domain.project.repository;

import org.example.promate.domain.project.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    //사용자가 프로젝트에 참여하고 있는지 여부 확인
    boolean existsByUserIdAndProjectId(Long userId, Long projectId);
    Optional<Member> findByIdAndProjectId(Long id, Long projectId);
    Optional<Member> findByUserIdAndProjectId(Long userId, Long projectId);
}