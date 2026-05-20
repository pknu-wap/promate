package org.example.promate.domain.user.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum UserErrorCode implements BaseErrorCode {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_E001", "사용자를 찾을 수 없습니다."),

    PROJECT_HISTORY_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_E002", "프로젝트 이력을 찾을 수 없습니다."),

    UNAUTHORIZED_USER(HttpStatus.UNAUTHORIZED, "USER_E003", "인증 토큰이 유효하지 않습니다."),

    FORBIDDEN_PROJECT_HISTORY(HttpStatus.FORBIDDEN, "USER_E004", "해당 프로젝트 이력에 접근할 수 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

}