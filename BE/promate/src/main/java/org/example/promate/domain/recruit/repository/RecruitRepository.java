package org.example.promate.domain.recruit.repository;

import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.enums.RecruitStatus;
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

    @Query("SELECT r FROM Recruit r WHERE r.user.id = :userId " +
            "AND (:status IS NULL OR r.status = :status)")
    Page<Recruit> findByUserIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") RecruitStatus status,
            Pageable pageable
    );
}