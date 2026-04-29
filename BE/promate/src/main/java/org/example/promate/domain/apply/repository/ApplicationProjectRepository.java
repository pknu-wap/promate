package org.example.promate.domain.apply.repository;

import org.example.promate.domain.apply.entity.ApplyProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationProjectRepository extends JpaRepository<ApplyProject, Long> {
}
