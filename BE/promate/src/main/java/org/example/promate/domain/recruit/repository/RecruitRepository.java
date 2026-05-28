package org.example.promate.domain.recruit.repository;

import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.enums.RecruitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecruitRepository extends JpaRepository<Recruit, Long>, RecruitRepositoryCustom {
    Optional<Recruit> findByIdAndIsDeletedFalse(Long id);
    List<Recruit> findAllByStatusAndDeadlineBefore(RecruitStatus status, LocalDateTime time);
}