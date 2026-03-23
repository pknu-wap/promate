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
@Table(name="event")
public class Event extends BaseEntity {    //캘린더 등록
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
}
