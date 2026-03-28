package org.example.promate.domain.recruit.repository;

import org.example.promate.domain.recruit.entity.Recruit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruitRepository extends JpaRepository<Recruit, Long> {

    /*
     1. 삭제되지 않은 특정 모집글 상세 조회
     Optional을 반환하여 Service 계층에서 .orElseThrow() 처리를 강제합니다.
     */
    Optional<Recruit> findByIdAndIsDeletedFalse(Long id);

    /*
     2. 삭제되지 않은 전체 모집글 페이징 조회
     최신순 정렬 등은 Service에서 Pageable 객체를 통해 넘겨받습니다.
     */
    Page<Recruit> findAllByIsDeletedFalse(Pageable pageable);

    /*
     3.특정 작성자가 올린 삭제되지 않은 글 목록
     */
    Page<Recruit> findAllByUserIdAndIsDeletedFalse(Long userId, Pageable pageable);
}