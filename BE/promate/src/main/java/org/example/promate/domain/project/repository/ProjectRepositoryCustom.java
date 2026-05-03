package org.example.promate.domain.project.repository;

import org.example.promate.domain.apply.dto.PastProjectDto;

import java.util.List;

public interface ProjectRepositoryCustom {
    List<PastProjectDto> findCompletedProjectsByUserId(Long userId);
}
