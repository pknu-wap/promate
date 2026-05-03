package org.example.promate.domain.workspace.converter;

import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.workspace.dto.req.ScheduleReqDto;
import org.example.promate.domain.workspace.dto.res.ScheduleResDto;
import org.example.promate.domain.workspace.entity.Schedule;

import java.util.List;

public class ScheduleConverter {
    // dto -> entity
    public static Schedule toEntity(ScheduleReqDto.AddScheduleDto dto, Project project){
        return Schedule.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .startAt(dto.getStartDate())
                .endAt(dto.getEndDate())
                .project(project)
                .build();
    }

    //entity -> dto
    public static ScheduleResDto.AddedScheduleInfoDto toAddedInfoDto(Schedule entity){
        return ScheduleResDto.AddedScheduleInfoDto.builder()
                .scheduleId(entity.getId())
                .projectId(entity.getProject().getId())
                .title(entity.getTitle())
                .startDate(entity.getStartAt())
                .endDate(entity.getEndAt())
                .build();
    }

    // entity -> listDto
    public static ScheduleResDto.MonthlyScheduleListInfoDto toMonthlyScheduleListInfoDto(List<Schedule> monthlySchedule){
        return ScheduleResDto.MonthlyScheduleListInfoDto.builder()
                .monthlyScheduleList(monthlySchedule.stream()
                        .map(schedule -> toMonthlyScheduleInfoDto(schedule))
                        .toList())
                .build();
    }

    // entity -> dto
    public static ScheduleResDto.MonthlyScheduleInfoDto toMonthlyScheduleInfoDto(Schedule entity){
        return ScheduleResDto.MonthlyScheduleInfoDto.builder()
                .scheduleId(entity.getId())
                .title(entity.getTitle())
                .startDate(entity.getStartAt())
                .endDate(entity.getEndAt())
                .build();
    }

    // entity -> dto
    public static ScheduleResDto.ProjectScheduleDetailInfoDto toScheduleDetailInfoDto(Schedule entity){
        return ScheduleResDto.ProjectScheduleDetailInfoDto.builder()
                .scheduleId(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .startDate(entity.getStartAt())
                .endDate(entity.getEndAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    //entity -> dto
    public static ScheduleResDto.ModifiedScheduleInfoDto toModifiedScheduleInfoDto(Schedule entity){
        return ScheduleResDto.ModifiedScheduleInfoDto.builder()
                .scheduleId(entity.getId())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    // entity -> dto
    public static ScheduleResDto.DeletedScheduleInfoDto toDeletedScheduleInfoDto(Schedule entity){
        return ScheduleResDto.DeletedScheduleInfoDto.builder()
                .scheduleId(entity.getId())
                .deletedAt(entity.getDeletedAt())
                .build();
    }
}
