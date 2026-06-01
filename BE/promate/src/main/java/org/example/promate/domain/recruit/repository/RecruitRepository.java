package org.example.promate.domain.recruit.repository;

import org.example.promate.domain.recruit.entity.Recruit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruitRepository extends JpaRepository<Recruit, Long>, RecruitRepositoryCustom {
    Optional<Recruit> findByIdAndIsDeletedFalse(Long id);

    @Query("SELECT r FROM Recruit r " +
            "WHERE r.user.id = :userId " +
            "AND r.isDeleted = false " +    //삭제되지 않은 게시글만 필터링
       "AND r.status = 'RECRUITING'")       //모집 중인 게시글만 필터링
    Page<Recruit> findActiveRecruitmentsByUserId(
            @Param("userId") Long userId,
            Pageable pageable
    );
}