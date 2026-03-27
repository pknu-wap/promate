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
    private String email;
    private String phoneNumber;

    public static UserResponseDTO from(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getKakaoId(),
                user.getName(),
                user.getProfileImageUrl(),
                user.getEmail(),
                user.getPhoneNumber()
        );
    }
}