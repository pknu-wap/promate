package org.example.promate.domain.workspace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.example.promate.global.entity.BaseTimeEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="task")
public class Task extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="title", nullable = false)
    private String title;

    @Column(name="content", nullable = false)
    private String content;

    @Column(name="status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    //mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="project_id")
    private Project project;

    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY)
    @Builder.Default
    private List<TaskAssignee> taskAssignees = new ArrayList<>();
}
