package org.example.promate.domain.workspace.service.command;

import org.example.promate.domain.workspace.dto.req.ScheduleReqDto;
import org.example.promate.domain.workspace.dto.res.ScheduleResDto;

public interface ScheduleCommandService {
    ScheduleResDto.AddedScheduleInfoDto addSchedule(Long userId, Long projectId, ScheduleReqDto.AddScheduleDto dto);
    ScheduleResDto.ModifiedScheduleInfoDto modifySchedule(Long userId, Long projectId, Long scheduleId, ScheduleReqDto.ModifyScheduleDto dto);
    ScheduleResDto.DeletedScheduleInfoDto deleteSchedule(Long userId, Long projectId, Long scheduleId);
}
