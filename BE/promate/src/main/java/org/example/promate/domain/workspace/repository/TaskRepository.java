package org.example.promate.domain.workspace.repository;

import org.example.promate.domain.workspace.entity.Task;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectIdAndIsDeletedFalse(Long projectId);
    int countAllByProjectIdAndIsDeletedFalse(Long projectId);
    int countAllByProjectIdAndStatusAndIsDeletedFalse(Long projectId, TaskStatus status);

    // N+1 방지: Task를 가져올 때 Task의 Member, Project 정보도 한 번에 가져옴(삭제되지 않은 정보 대상)
    @Query("select t from Task t " +
            "join fetch t.member m " +
            "join fetch t.project p " +
            "where t.id = :taskId " +
            "and t.isDeleted = false")
    Optional<Task> findByIdAndIsDeletedFalse(@Param("taskId")Long id);
}
