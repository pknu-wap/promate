package org.example.promate.domain.workspace.converter;

import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.workspace.dto.req.TaskReqDto;
import org.example.promate.domain.workspace.dto.res.TaskResDto;
import org.example.promate.domain.workspace.entity.Task;

import java.util.List;

public class TaskConverter {
    // entity -> dto
    public static TaskResDto.TaskPreviewInfoDto toTaskPreviewInfoDto(Task entity){
        return TaskResDto.TaskPreviewInfoDto.builder()
                .taskId(entity.getId())
                .title(entity.getTitle())
                .status(entity.getStatus())
                .dueDate(entity.getDueDate())
                .build();
    }

    // entity -> listDto
    public static TaskResDto.TaskPreviewInfoListDto toTaskPreviewListInfoDto(List<Task> taskList, int size, double projectProgress){
        return TaskResDto.TaskPreviewInfoListDto.builder()
                .taskList(taskList.stream()
                        .map(task -> toTaskPreviewInfoDto(task))
                        .toList())
                .size(size)
                .projectProgress(projectProgress)
                .build();
    }

    //entity -> dto
    public static TaskResDto.TaskInfoDto toTaskInfoDto(Task task){
        return TaskResDto.TaskInfoDto.builder()
                .taskId(task.getId())
                .role(task.getMember().getRole())
                .managerName(task.getMember().getUser().getName())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .build();
    }

    //dto -> entity
    public static Task toEntity(TaskReqDto.AddTaskDto dto, Project project, Member member){
        return Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .dueDate(dto.getDueDate())
                .project(project)
                .member(member)
                .build();
    }

    //entity -> dto
    public static TaskResDto.ModifiedTaskInfoDto toModifiedTaskInfoDto(Task task){
        return TaskResDto.ModifiedTaskInfoDto.builder()
                .taskId(task.getId())
                .status(task.getStatus())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    // entity -> dto
    public static TaskResDto.UpdatedStatusTaskInfoDto toUpdatedStatusTaskInfoDto(Task task, double projectProgress, boolean isProjectCompleted){
        return TaskResDto.UpdatedStatusTaskInfoDto.builder()
                .taskId(task.getId())
                .status(task.getStatus())
                .updatedAt(task.getUpdatedAt())
                .projectProgress(projectProgress)
                .isProjectCompleted(isProjectCompleted)
                .build();
    }

    public static TaskResDto.DeletedTaskInfoDto toDeletedTaskInfoDto(Task task){
        return TaskResDto.DeletedTaskInfoDto.builder()
                .taskId(task.getId())
                .deletedAt(task.getDeletedAt())
                .build();
    }

}