package org.example.promate.domain.project.respository;

import org.example.promate.domain.project.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByUser_IdAndProject_Id(Long userId, Long projectId);
}
