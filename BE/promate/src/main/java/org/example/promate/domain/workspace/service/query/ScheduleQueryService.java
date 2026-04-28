package org.example.promate.domain.workspace.service.query;

import org.example.promate.domain.workspace.dto.res.ScheduleResDto;

public interface ScheduleQueryService {
    ScheduleResDto.MonthlyScheduleListInfoDto getMonthlySchedules(Long userId, Long projectId, Integer year, Integer month);
    ScheduleResDto.ProjectScheduleDetailInfoDto getScheduleDetails(Long userId, Long projectId, Long scheduleId);

}
