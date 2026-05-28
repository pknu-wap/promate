package org.example.promate.domain.workspace.repository;

import org.example.promate.domain.workspace.entity.Task;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectIdAndIsDeletedFalse(Long projectId);
    int countAllByProjectIdAndIsDeletedFalse(Long projectId);
    int countAllByProjectIdAndStatusAndIsDeletedFalse(Long projectId, TaskStatus status);
    int countAllByProjectIdAndStatusInAndIsDeletedFalse(Long projectId, List<TaskStatus> statuses);

    // N+1 방지: Task를 가져올 때 Task의 Member, Project 정보도 한 번에 가져옴(삭제되지 않은 정보 대상)
    @Query("select t from Task t " +
            "join fetch t.member m " +
            "join fetch t.project p " +
            "where t.id = :taskId " +
            "and t.isDeleted = false")
    Optional<Task> findByIdAndIsDeletedFalse(@Param("taskId")Long id);

    int countByProjectIdAndStatus(Long projectId, TaskStatus status);
    int countByProjectIdAndStatusIn(Long projectId, List<TaskStatus> statuses); // 완료, 미완료 task 조회

    // dashboard에서 사용
    List<Task> findByMemberUserIdAndDueDateBetweenAndIsDeletedFalse(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Task> findByMemberUserIdAndStatusAndIsDeletedFalse(
            Long userId,
            TaskStatus status
    );


    // 1.특정 프로젝트 내부의 상세 내역을 긁어올 때 사용
    @Query("SELECT t FROM Task t " +
            "WHERE t.project.id = :projectId " +
            "AND t.member.user.id = :userId")
    List<Task> findAllByProjectIdAndApplicantUserId(
            @Param("projectId") Long projectId,
            @Param("userId") Long userId
    );

    // 지원서 프로필용: 완료된 모든 프로젝트에서의 총 태스크 수 (User ID 기반)
    @Query("SELECT COUNT(t) FROM Task t " +
            "JOIN t.member m JOIN t.project p " +
            "WHERE m.user.id = :userId AND p.status = 'COMPLETED'")
    int countTotalTasksByUserIdInCompletedProjects(@Param("userId") Long userId);

    // 지원서 프로필용: 완료된 모든 프로젝트에서의 DONE 태스크 수 (User ID 기반)
    @Query("SELECT COUNT(t) FROM Task t " +
            "JOIN t.member m JOIN t.project p " +
            "WHERE m.user.id = :userId AND p.status = 'COMPLETED' AND t.status = 'DONE'")
    int countCompletedTasksByUserIdInCompletedProjects(@Param("userId") Long userId);


    // 지원서 묶음 조회용
    @Query("SELECT m.user.id, COUNT(t) FROM Task t " +
            "JOIN t.member m JOIN t.project p " +
            "WHERE m.user.id IN :userIds AND p.status = 'COMPLETED' " +
            "GROUP BY m.user.id")
    List<Object[]> countTotalTasksByUserIdsInCompletedProjects(@Param("userIds") List<Long> userIds);

    @Query("SELECT m.user.id, COUNT(t) FROM Task t " +
            "JOIN t.member m JOIN t.project p " +
            "WHERE m.user.id IN :userIds AND p.status = 'COMPLETED' AND t.status = 'DONE' " +
            "GROUP BY m.user.id")
    List<Object[]> countCompletedTasksByUserIdsInCompletedProjects(@Param("userIds") List<Long> userIds);
    // 프로필페이지 특정 user의 테스크 개수 반환
    int countByProjectIdAndMemberIdAndStatus(
            Long projectId,
            Long memberId,
            TaskStatus status
    );

    int countByProjectIdAndMemberIdAndStatusIn(
            Long projectId,
            Long memberId,
            List<TaskStatus> statuses
    );

}
