package org.example.promate.domain.mypage.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyRecruitResponseDTO {

    private Long recruitmentId;
    private String title;
    private long applicantCount;
}