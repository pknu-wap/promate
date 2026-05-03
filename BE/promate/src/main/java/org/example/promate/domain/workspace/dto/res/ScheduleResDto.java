package org.example.promate.domain.workspace.dto.res;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ScheduleResDto {

    @Builder
    @Getter
    @JsonPropertyOrder({"scheduleId", "projectId", "title", "startDate", "endDate"})
    public static class AddedScheduleInfoDto{
        private Long scheduleId;
        private Long projectId;
        private String title;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    //월간 개별 스케줄
    @Builder
    @Getter
    @JsonPropertyOrder({"scheduleId", "title", "startDate", "endDate"})
    public static class MonthlyScheduleInfoDto{
        private Long scheduleId;
        private String title;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    //월간 스케줄 리스트 목록
    @Builder
    @Getter
    public static class MonthlyScheduleListInfoDto{
        List<MonthlyScheduleInfoDto> monthlyScheduleList;
    }

    //팀 일정 상세 조회
    @Builder
    @Getter
    @JsonPropertyOrder({"scheduleId", "title", "content", "startDate", "endDate", "createdAt", "updatedAt"})
    public static class ProjectScheduleDetailInfoDto{
        private Long scheduleId;
        private String title;
        private String content;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    // 팀 일정 수정하기
    @Builder
    @Getter
    @JsonPropertyOrder({"scheduleId", "updatedAt"})
    public static class ModifiedScheduleInfoDto{
        private Long scheduleId;
        private LocalDateTime updatedAt;
    }

    // 팀 일정 삭제하기
    @Builder
    @Getter
    @JsonPropertyOrder({"scheduleId", "deletedAt"})
    public static class DeletedScheduleInfoDto{
        private Long scheduleId;
        private LocalDateTime deletedAt;
    }

}
