package org.example.promate.domain.project;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.example.promate.domain.project.repository.ProjectRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProjectScheduler {

    private final ProjectRepository projectRepository;

    //프로젝트 만료일 (localDate 타입) 검사
    //만료 되었다면 상호 평가 가능하도록
    // 매일 새벽 00시 01분에 실행
    @Scheduled(cron = "0 1 0 * * *")
    @Transactional
    public void autoTerminateProjects() {
        LocalDate today = LocalDate.now();
        List<Project> expiredProjects = projectRepository
                .findAllByStatusAndEndDateLessThanEqual(ProjectStatus.ACTIVE, today.minusDays(1));

        for (Project project : expiredProjects) {
            project.updateStatus(ProjectStatus.COMPLETED);
        }
    }
}
