package org.example.promate.domain.apply.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.promate.domain.project.entity.Project;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA를 위한 최소한의 접근 허용
public class ApplyProject {


    //지원서 1개는 여러 가지 프로젝트 포함 가능 / 프로젝트 1개는 여러 지원서에 채택 가능
    //다대다 관계를 표현하기 위한 매핑 클래스임
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "apply_id")
    private Apply apply;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Builder
    public ApplyProject(Apply apply, Project project, Long promateProjectId ,Long manualProjectId, boolean isManual) {
        this.apply = apply;
        this.project = project;
        this.promateProjectId = promateProjectId; // 시스템 프로젝트일 경우 (null 가능)
        this.manualProjectId = manualProjectId; // 수동 프로젝트일 경우 (null 가능)
        this.isManual = isManual;
    }

    private boolean isManual; // true: 수동 입력한 프로젝트임 , false: ProMate에서 불러온 프로젝트임.

    // 프로메이트로 수행한 프로젝트일 경우의 연관관계
    private Long promateProjectId;

    // 수동 입력 프로젝트일 경우의 연관관계
    private Long manualProjectId;

    // 프로젝트 타입 조회용 메서드 (응답 시 활용)
    public String getProjectType() {
        return isManual ? "MANUAL" : "PROMATE";
    }
}