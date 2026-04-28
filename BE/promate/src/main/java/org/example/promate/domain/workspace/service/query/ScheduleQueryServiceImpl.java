package org.example.promate.domain.workspace.service.query;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.project.code.MemberErrorCode;
import org.example.promate.domain.project.exception.MemberException;
import org.example.promate.domain.project.respository.MemberRepository;
import org.example.promate.domain.workspace.code.ScheduleErrorCode;
import org.example.promate.domain.workspace.converter.ScheduleConverter;
import org.example.promate.domain.workspace.dto.res.ScheduleResDto;
import org.example.promate.domain.workspace.entity.Schedule;
import org.example.promate.domain.workspace.exception.ScheduleException;
import org.example.promate.domain.workspace.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleQueryServiceImpl implements ScheduleQueryService{
    private final ScheduleRepository scheduleRepository;
    private final MemberRepository memberRepository;

    // 월간 스케줄 조회
    @Override
    public ScheduleResDto.MonthlyScheduleListInfoDto getMonthlySchedules(Long userId, Long projectId, Integer year, Integer month) {
        //사용자가 해당 프로젝트의 팀원인지 확인
        if(!memberRepository.existsByUser_IdAndProject_Id(userId, projectId)){
            throw new MemberException(MemberErrorCode.SCHEDULE_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        // 검색 달 계산
        YearMonth target = YearMonth.of(year, month);

        LocalDate searchStart = target.atDay(1);
        LocalDate searchEnd = target.atEndOfMonth();

        List<Schedule> monthlySchedule = scheduleRepository.findSchedulesByProjectAndMonthAndIsDeletedFalse(projectId, searchStart, searchEnd);

        return ScheduleConverter.toMonthlyScheduleListInfoDto(monthlySchedule);
    }

    // 단건 스케줄 조회
    @Override
    public ScheduleResDto.ProjectScheduleDetailInfoDto getScheduleDetails(Long userId, Long projectId, Long scheduleId) {
        //사용자가 해당 프로젝트의 팀원인지 확인
        if(!memberRepository.existsByUser_IdAndProject_Id(userId, projectId)){
            throw new MemberException(MemberErrorCode.SCHEDULE_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        Schedule schedule = scheduleRepository.findByIdAndIsDeletedFalse(scheduleId).orElseThrow(() -> new ScheduleException(ScheduleErrorCode.ID_NOT_FOUND));

        return ScheduleConverter.toScheduleDetailInfoDto(schedule);
    }
}
