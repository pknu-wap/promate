package org.example.promate.domain.apply.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.domain.apply.enums.Status;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.user.entity.User;
import org.example.promate.global.entity.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@SuperBuilder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="apply")
public class Apply extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="objective")
    private String objective; //희망 직무 (팀 승인 절차에서 분별을 위한 메타데이터)

    @Column(name="pr_content")
    private String prContent;

    @Column(name="status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    //mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="recruit_id")
    private Recruit recruit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    //매핑 클래스의 리스트를 추가
    @OneToMany(mappedBy = "apply", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ApplyProject> applyProjects = new ArrayList<>();

    public void updateStatus(Status status){
        this.status = status;
    }
    public void updateprContent(String prContent){
        this.prContent = prContent;
    }

    public void delete(){ super.performDelete();}

    public void updatePastProjects(List<Project> newProjects) {
        // 1. 기존 연관관계 제거 (orphanRemoval = true에 의해 DB에서도 삭제됨)
        this.applyProjects.clear();

        // 2. 새로운 프로젝트들로 매핑 객체 생성 및 추가
        if (newProjects != null) {
            newProjects.forEach(project -> {
                ApplyProject applyProject = ApplyProject.builder()
                        .apply(this)
                        .project(project)
                        .build();
                this.applyProjects.add(applyProject);
            });
        }
    }

}
