package org.example.promate.domain.workspace.service.command;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.project.code.MemberErrorCode;
import org.example.promate.domain.project.code.ProjectErrorCode;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.exception.MemberException;
import org.example.promate.domain.project.exception.ProjectException;
import org.example.promate.domain.project.respository.MemberRepository;
import org.example.promate.domain.project.respository.ProjectRepository;
import org.example.promate.domain.workspace.code.ScheduleErrorCode;
import org.example.promate.domain.workspace.converter.ScheduleConverter;
import org.example.promate.domain.workspace.dto.req.ScheduleReqDto;
import org.example.promate.domain.workspace.dto.res.ScheduleResDto;
import org.example.promate.domain.workspace.entity.Schedule;
import org.example.promate.domain.workspace.exception.ScheduleException;
import org.example.promate.domain.workspace.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleCommandServiceImpl implements ScheduleCommandService{
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final ScheduleRepository scheduleRepository;

    // 팀 일정 추가하기
    @Override
    public ScheduleResDto.AddedScheduleInfoDto addSchedule(Long userId, Long projectId, ScheduleReqDto.AddScheduleDto dto) {
        //사용자가 해당 프로젝트의 팀원인지 확인
        if(!memberRepository.existsByUser_IdAndProject_Id(userId, projectId)){
            throw new MemberException(MemberErrorCode.SCHEDULE_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectException(ProjectErrorCode.ID_NOT_FOUND));

        Schedule entity = ScheduleConverter.toEntity(dto, project);
        Schedule saved = scheduleRepository.save(entity);

        return ScheduleConverter.toAddedInfoDto(saved);
    }

    // 팀 일정 수정하기
    @Override
    public ScheduleResDto.ModifiedScheduleInfoDto modifySchedule(Long userId, Long projectId, Long scheduleId, ScheduleReqDto.ModifyScheduleDto dto) {
        //사용자가 해당 프로젝트의 팀원인지 확인
        if(!memberRepository.existsByUser_IdAndProject_Id(userId, projectId)){
            throw new MemberException(MemberErrorCode.SCHEDULE_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        Schedule schedule = scheduleRepository.findByIdAndIsDeletedFalse(scheduleId).orElseThrow(() -> new ScheduleException(ScheduleErrorCode.ID_NOT_FOUND));

        schedule.modify(dto.getTitle(), dto.getContent(), dto.getStartDate(), dto.getEndDate());
        scheduleRepository.saveAndFlush(schedule);

        return ScheduleConverter.toModifiedScheduleInfoDto(schedule);
    }

    // 팀 일정 삭제하기
    @Override
    public ScheduleResDto.DeletedScheduleInfoDto deleteSchedule(Long userId, Long projectId, Long scheduleId) {
        //사용자가 해당 프로젝트의 팀원인지 확인
        if(!memberRepository.existsByUser_IdAndProject_Id(userId, projectId)){
            throw new MemberException(MemberErrorCode.SCHEDULE_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        Schedule schedule = scheduleRepository.findByIdAndIsDeletedFalse(scheduleId).orElseThrow(() -> new ScheduleException(ScheduleErrorCode.ID_NOT_FOUND));

        schedule.delete();

        return ScheduleConverter.toDeletedScheduleInfoDto(schedule);
    }
}
