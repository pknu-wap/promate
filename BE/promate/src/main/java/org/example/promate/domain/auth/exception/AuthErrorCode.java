package org.example.promate.domain.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum AuthErrorCode {

    STATE_NOT_FOUND(HttpStatus.BAD_REQUEST, "AUTH_001", "state 값이 없습니다."),
    STATE_MISMATCH(HttpStatus.BAD_REQUEST, "AUTH_002", "state 값이 일치하지 않습니다."),
    KAKAO_TOKEN_REQUEST_FAILED(HttpStatus.UNAUTHORIZED, "AUTH_003", "카카오 토큰 요청 실패"),
    KAKAO_USER_INFO_FAILED(HttpStatus.UNAUTHORIZED, "AUTH_004", "카카오 사용자 정보 조회 실패");

    private final HttpStatus status;
    private final String code;
    private final String message;

    AuthErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}