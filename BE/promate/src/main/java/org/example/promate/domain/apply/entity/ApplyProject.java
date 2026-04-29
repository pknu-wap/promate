package org.example.promate.domain.apply.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.promate.domain.project.entity.Project;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
    public ApplyProject(Apply apply, Project project) {
        this.apply = apply;
        this.project = project;
    }
}