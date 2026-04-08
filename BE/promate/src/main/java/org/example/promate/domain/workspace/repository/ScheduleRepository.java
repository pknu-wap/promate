package org.example.promate.domain.workspace.repository;

import org.example.promate.domain.workspace.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("SELECT s FROM Schedule s " +
            "WHERE s.project.id = :projectId " + // 프로젝트 필터링 추가

            // 03/25~04/02 의 일정인 경우 03/01~03/31 기간 조회 시 검색 안 됨
            // 따라서 시작일이 검색하고자 하는 월의 마지막 날 이전이고, 마감일이 검색하고자 하는 월의 시작일 이후면 검색
            "AND s.startAt <= :searchEnd " +     // 기간 조건 1
            "AND s.endAt >= :searchStart")
        // 기간 조건 2
    List<Schedule> findSchedulesByProjectAndMonth(
            @Param("projectId") Long projectId,
            @Param("searchStart") LocalDate searchStart,
            @Param("searchEnd") LocalDate searchEnd
    );

    Optional<Schedule> findByIdAndIsDeletedFalse(Long id);

}
