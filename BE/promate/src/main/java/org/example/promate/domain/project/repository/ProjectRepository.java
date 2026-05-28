package org.example.promate.domain.project.repository;

import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {
    Optional<Project> findById(Long id);

    List<Project> findAllByStatusAndEndDateLessThanEqual(ProjectStatus status, LocalDate date);
}

