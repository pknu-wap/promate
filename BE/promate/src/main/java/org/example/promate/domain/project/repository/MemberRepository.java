package org.example.promate.domain.project.repository;

import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {
    Optional<Member> findByProjectIdAndUserId(Long projectId, Long userId);

    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    Optional<Member> findByIdAndProjectId(Long userId,Long projectId);
    Optional<Member> findByUserIdAndProjectId(Long userId,Long projectId);


    List<Member> findByUserIdAndProjectStatus(Long userId, ProjectStatus status); // 프로젝트 상태까지 확인

}
