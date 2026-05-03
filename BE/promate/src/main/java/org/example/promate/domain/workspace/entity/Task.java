package org.example.promate.domain.workspace.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.workspace.dto.req.TaskReqDto;
import org.example.promate.domain.workspace.enums.TaskStatus;
import org.example.promate.global.entity.BaseEntity;

import java.time.LocalDate;

@Entity
@SuperBuilder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="task")
public class Task extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="title", nullable = false)
    private String title;

    @Column(name="description", nullable = false)
    private String description;

    @Column(name="status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;

    @Column(name="due_date", nullable = false)
    private LocalDate dueDate;

    //mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
    private Member member;

    // 데이터 수정
    public void modify(TaskReqDto.ModifyTaskDto dto){
        this.title = dto.getTitle();
        this.description = dto.getDescription();
        this.dueDate = dto.getDueDate();
    }

    public void modify(Member member){
        this.member = member;
    }

    // 상태 변경
    public void updateStatus(TaskStatus status){
        this.status = status;
    }

    // BaseEntity의 performDelete()가 protected이므로 외부 호출을 위해 추가
    public void delete() {
        super.performDelete();
    }
}
