package org.example.promate.domain.project.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.domain.project.enums.Position;
import org.example.promate.domain.user.entity.User;

import org.example.promate.domain.workspace.entity.MeetingLog;
import org.example.promate.domain.workspace.entity.Notice;
import org.example.promate.global.entity.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@SuperBuilder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)

@Table(name="member")
public class Member extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="role", nullable = false)
    private String role;

    @Column(name="member_position", nullable = false) //MySQL 예약어랑 겹쳐서 수정
    @Enumerated(EnumType.STRING)
    private Position position;

    //mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="project_id")
    private Project project;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    @Builder.Default
    private List<MeetingLog> meetingLogs = new ArrayList<>();

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Notice> notices = new ArrayList<>();

    public void delete(){
        super.performDelete();
    }
}
