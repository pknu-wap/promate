package org.example.promate.domain.project.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.workspace.entity.Event;
import org.example.promate.domain.workspace.entity.Post;
import org.example.promate.domain.workspace.entity.Task;
import org.example.promate.global.entity.BaseTimeEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="project")
public class Project extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name="title", nullable = false)
    private String title;

    @Column(name="description", nullable = false)
    private String description;

    @Column(name="start_date")
    private LocalDate startDate;

    @Column(name="end_date")
    private LocalDate endDate;

    @Column(name="status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    //mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="leader_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="recruit_id")
    private Recruit recruit;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Member> members = new ArrayList<>();

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Event> events = new ArrayList<>();

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Post> posts = new ArrayList<>();
}
