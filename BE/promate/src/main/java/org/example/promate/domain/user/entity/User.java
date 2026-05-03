package org.example.promate.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.domain.apply.entity.Apply;
import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.entity.RecruitWishlist;
import org.example.promate.global.entity.BaseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@SuperBuilder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="kakao_id", nullable = false)
    private Long kakaoId;

    @Column(name="name", nullable = true)
    private String name;

    @Column(name="profile_image_url", nullable = true)
    private String profileImageUrl;

    @Column(name="manner_temp", nullable = true)
    private BigDecimal mannerTemp;

    @Column(name="diligence_temp", nullable = true)
    private BigDecimal diligenceTemp;

    @Column(name="is_profile_completed", nullable = false)
    private boolean isProfileCompleted;

    //mapping
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    private List<RecruitWishlist> recruitWishlists = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Recruit> recruits = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Member> members = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Apply> applies = new ArrayList<>();

    public void updateProfile(String name, String profileImageUrl) {
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.isProfileCompleted = true;
    }
}
