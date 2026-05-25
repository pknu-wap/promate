package org.example.promate.domain.project.repository;

import org.example.promate.domain.project.entity.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectRepositoryCustom {
    List<Project> findCompletedProjectsByUserId(Long userId);
}
