package org.example.promate.domain.project.entity;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.promate.domain.user.entity.User;


//promate에서 수행한 프로젝트가 아닌, 수동 입력한 가상 프로젝트
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ManualProject {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String title; // 프로젝트명
    private String period; // 기간

    @Column(length = 50)
    private String taskDescription; //테스크 불러오는 대신 50자 이내의 설명 적기

    private String role;
}