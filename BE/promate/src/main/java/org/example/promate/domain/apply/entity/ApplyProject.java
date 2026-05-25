package org.example.promate.domain.apply.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.promate.domain.project.entity.Project;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApplyProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "apply_id")
    private Apply apply;

    // PROMATE 프로젝트일 경우 객체 그래프 탐색을 위해 매핑 (null 가능)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private boolean isManual; // true: 수동 입력(UserProjectHistory), false: ProMate 프로젝트

    // 수동 입력 프로젝트일 경우, 테이블 PK 보관 (null 가능)
    private Long manualProjectId;

    @Builder
    public ApplyProject(Apply apply, Project project, Long manualProjectId, boolean isManual) {
        this.apply = apply;
        this.project = project;
        this.manualProjectId = manualProjectId;
        this.isManual = isManual;
    }

    public String getProjectType() {
        return isManual ? "MANUAL" : "PROMATE";
    }
}