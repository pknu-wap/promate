package org.example.promate.domain.project.repository;

import org.example.promate.domain.apply.dto.PastProjectDto;
import org.example.promate.domain.project.entity.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectRepositoryCustom {
    List<PastProjectDto> findCompletedProjectsByUserId(Long userId);
}
