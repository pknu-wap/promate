package org.example.promate.domain.project.entity;


import jakarta.persistence.*;
import lombok.*;
import org.example.promate.domain.project.enums.Position;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.workspace.entity.Post;
import org.example.promate.domain.workspace.entity.TaskAssignee;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="role", nullable = false)
    private String role;

    @Column(name="position", nullable = false)
    @Enumerated(EnumType.STRING)
    private Position position;

    @CreatedDate
    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt;

    //mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="project_id")
    private Project project;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    @Builder.Default
    private List<TaskAssignee> taskAssignees = new ArrayList<>();

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Post> posts = new ArrayList<>();
}
