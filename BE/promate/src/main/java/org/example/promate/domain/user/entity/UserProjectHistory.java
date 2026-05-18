package org.example.promate.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.global.entity.BaseEntity;

@Entity
@Getter
@SuperBuilder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_project_history")
public class UserProjectHistory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="project_name", nullable = false)
    private String projectName;

    @Column(name="role", nullable = true)
    private String role;

    @Column(name="period", nullable = true)
    private String period;

    @Column(name="description", columnDefinition = "TEXT", nullable = true)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public void update(String projectName, String role, String period, String description) {
        this.projectName = projectName;
        this.role = role;
        this.period = period;
        this.description = description;
    }
}