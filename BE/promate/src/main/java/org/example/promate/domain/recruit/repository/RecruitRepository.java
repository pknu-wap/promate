package org.example.promate.domain.recruit.repository;

import org.example.promate.domain.recruit.entity.Recruit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecruitRepository extends JpaRepository<Recruit, Long>, RecruitRepositoryCustom {
    Optional<Recruit> findByIdAndIsDeletedFalse(Long id);


    /*
     특정 작성자가 올린 삭제되지 않은 글 목록(리스트)
     */
    List<Recruit> findByUserIdAndIsDeletedFalse(Long userId);



}