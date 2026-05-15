package org.example.promate.domain.project.repository;

import org.example.promate.domain.project.entity.ManualProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManualProjectRepository extends JpaRepository<ManualProject,Long> {
}
