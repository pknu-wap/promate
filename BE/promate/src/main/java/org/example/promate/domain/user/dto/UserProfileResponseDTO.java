package org.example.promate.domain.user.dto;

import lombok.Builder;
import lombok.Getter;
import org.example.promate.domain.user.entity.User;

import java.util.List;

@Getter
@Builder
public class UserProfileResponseDTO {

    private Long id;
    private Long kakaoId;
    private String name;
    private String profileImageUrl;

    private List<UserPromateProjectResponseDTO> promateProjects;
    private List<UserProjectHistoryResponseDTO> customProjects;

    public static UserProfileResponseDTO of(
            User user,
            List<UserPromateProjectResponseDTO> promateProjects,
            List<UserProjectHistoryResponseDTO> customProjects
    ) {
        return UserProfileResponseDTO.builder()
                .id(user.getId())
                .kakaoId(user.getKakaoId())
                .name(user.getName())
                .profileImageUrl(user.getProfileImageUrl())
                .promateProjects(promateProjects)
                .customProjects(customProjects)
                .build();
    }
}