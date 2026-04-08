package org.example.promate.domain.workspace.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.global.entity.BaseEntity;

import java.time.LocalDate;

@Entity
@SuperBuilder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="schedule")
public class Schedule extends BaseEntity {    //캘린더 등록
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="title", nullable = false)
    private String title;

    @Column(name="content", nullable = false)
    private String content;

    @Column(name="start_at", nullable = false)
    private LocalDate startAt;

    @Column(name="end_at", nullable = false)
    private LocalDate endAt;

    //mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="project_id")
    private Project project;

    // 팀 일정 수정 메서드
    public void modify(String title, String content, LocalDate startAt, LocalDate endAt){
        this.title = title;
        this.content = content;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}
