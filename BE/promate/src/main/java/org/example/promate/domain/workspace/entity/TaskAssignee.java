package org.example.promate.domain.workspace.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.domain.project.entity.Member;

@Entity
@SuperBuilder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="task_assignee")
public class TaskAssignee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="task_id")
    private Task task;
}
