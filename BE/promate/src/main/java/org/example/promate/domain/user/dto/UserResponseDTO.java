package org.example.promate.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.domain.user.entity.User;

@Getter
@AllArgsConstructor
public class UserResponseDTO {
    private Long Id;
    private Long kakaoId;
    private String name;
    private String profileImageUrl;

    public static UserResponseDTO from(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getKakaoId(),
                user.getName(),
                user.getProfileImageUrl()

        );
    }
}