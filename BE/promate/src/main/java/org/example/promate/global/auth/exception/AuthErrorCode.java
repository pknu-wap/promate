package org.example.promate.global.auth.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum AuthErrorCode {

    STATE_NOT_FOUND(HttpStatus.BAD_REQUEST, "AUTH_001", "state 값이 없습니다."),
    STATE_MISMATCH(HttpStatus.BAD_REQUEST, "AUTH_002", "state 값이 일치하지 않습니다."),
    KAKAO_TOKEN_REQUEST_FAILED(HttpStatus.UNAUTHORIZED, "AUTH_003", "카카오 토큰 요청 실패"),
    KAKAO_USER_INFO_FAILED(HttpStatus.UNAUTHORIZED, "AUTH_004", "카카오 사용자 정보 조회 실패"),

    REFRESH_TOKEN_NOT_FOUND(HttpStatus.BAD_REQUEST, "AUTH_005", "refresh token이 없습니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH_006", "유효하지 않은 refresh token입니다."),
    INVALID_REFRESH_TOKEN_TYPE(HttpStatus.UNAUTHORIZED, "AUTH_007", "refresh token 타입이 아닙니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "AUTH_008", "해당 유저가 없습니다."),
    STORED_REFRESH_TOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "AUTH_009", "저장된 refresh token이 없습니다."),
    REFRESH_TOKEN_MISMATCH(HttpStatus.UNAUTHORIZED, "AUTH_010", "저장된 refresh token과 일치하지 않습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

}