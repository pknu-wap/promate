package org.example.promate.domain.apply.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.domain.apply.enums.Status;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.user.entity.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@SuperBuilder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="apply")
@EntityListeners(AuditingEntityListener.class)
public class Apply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="pr_content")
    private String prContent;

    @Column(name="status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @CreatedDate
    @Column(name="created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    //mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="recruit_id")
    private Recruit recruit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;
}
