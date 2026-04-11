package org.example.promate.domain.project.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ProjectErrorCode implements BaseErrorCode {
    ID_NOT_FOUND(HttpStatus.NOT_FOUND, "PROJECT_E001", "해당 프로젝트를 찾을 수 없습니다."),
    ;


    private final HttpStatus status;
    private final String code;
    private final String message;
}
