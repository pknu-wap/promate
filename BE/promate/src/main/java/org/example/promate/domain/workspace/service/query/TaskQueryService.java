package org.example.promate.domain.workspace.service.query;

import org.example.promate.domain.workspace.dto.res.TaskResDto;

public interface TaskQueryService {
    TaskResDto.TaskPreviewInfoListDto getTaskPreviewList(Long userId, Long projectId);
    TaskResDto.TaskInfoDto getTask(Long userId, Long projectId, Long taskId);
    double calculateProjectProgress(Long projectId);
}
