package org.example.promate.domain.project.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum MemberErrorCode implements BaseErrorCode {
    SCHEDULE_FORBIDDEN_NOT_PROJECT_MEMBER(HttpStatus.FORBIDDEN, "MEMBER_E001", "해당 프로젝트에 속한 사용자만 수행 가능합니다."),
    ;


    private final HttpStatus status;
    private final String code;
    private final String message;
}