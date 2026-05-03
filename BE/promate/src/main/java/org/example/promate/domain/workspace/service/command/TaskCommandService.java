package org.example.promate.domain.workspace.service.command;

import org.example.promate.domain.workspace.dto.req.TaskReqDto;
import org.example.promate.domain.workspace.dto.res.TaskResDto;

public interface TaskCommandService {
    TaskResDto.TaskInfoDto addTask(Long userId, Long projectId, TaskReqDto.AddTaskDto dto);
    TaskResDto.ModifiedTaskInfoDto modifyTask(Long userId, Long projectId, Long taskId, TaskReqDto.ModifyTaskDto dto);
    TaskResDto.UpdatedStatusTaskInfoDto updateTaskStatus(Long userId, Long projectId, Long taskId, TaskReqDto.UpdateTaskStatusDto dto);
    TaskResDto.DeletedTaskInfoDto deleteTask(Long userId, Long projectId, Long taskId);
}
