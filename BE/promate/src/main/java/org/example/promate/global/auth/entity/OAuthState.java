package org.example.promate.global.auth.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OAuthState {

    @Id
    private String state;

    private LocalDateTime expiredAt;

    @Builder
    public OAuthState(String state, LocalDateTime expiredAt) {
        this.state = state;
        this.expiredAt = expiredAt;
    }
}