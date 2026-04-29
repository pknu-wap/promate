package org.example.promate.domain.apply.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.domain.apply.enums.Status;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.user.entity.User;
import org.example.promate.global.entity.BaseEntity;
import org.example.promate.global.entity.BaseTimeEntity;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
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
}
