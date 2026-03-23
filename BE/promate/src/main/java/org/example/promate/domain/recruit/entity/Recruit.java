package org.example.promate.domain.recruit.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.domain.apply.entity.Apply;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.recruit.enums.Category;
import org.example.promate.domain.recruit.enums.RecruitStatus;
import org.example.promate.domain.user.entity.User;
import org.example.promate.global.entity.BaseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@SuperBuilder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="recruit")
public class Recruit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="category", nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(name="title", nullable = false)
    private String title;

    @Column(name="description", nullable = false)
    private String description;

    @Column(name="status", nullable = false)
    @Enumerated(EnumType.STRING)
    private RecruitStatus status;

    @Column(name="joined_count", nullable = false)
    private int joinedCount;

    @Column(name="total_slots", nullable = false)
    private int totalSlots;

    @Column(name="deadline", nullable = false)
    private LocalDateTime deadline;

    //mapping
    @OneToMany(mappedBy = "recruit", fetch = FetchType.LAZY)
    @Builder.Default
    private List<RecruitWishlist> recruitWishlists = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @OneToMany(mappedBy = "recruit", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "recruit", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Apply> applies = new ArrayList<>();
}
