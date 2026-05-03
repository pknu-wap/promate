package org.example.promate.domain.project.repository;

import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    //사용자가 프로젝트에 참여하고 있는지 여부 확인
    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    Optional<Member> findByIdAndProjectId(Long id, Long projectId);

    Optional<Member> findByUserIdAndProjectId(Long userId, Long projectId);

    List<Member> findByUserIdAndProjectStatus(Long userId, ProjectStatus status); // 프로젝트 상태까지 확인
}