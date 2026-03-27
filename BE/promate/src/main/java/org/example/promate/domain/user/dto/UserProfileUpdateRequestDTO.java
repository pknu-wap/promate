package org.example.promate.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateRequestDTO {
    private String name;
    private String profileImageUrl;
    private String email;
    private String phoneNumber;
}