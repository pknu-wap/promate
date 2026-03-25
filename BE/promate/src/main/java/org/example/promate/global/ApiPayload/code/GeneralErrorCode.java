package org.example.promate.global.ApiPayload.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GeneralErrorCode implements BaseErrorCode{
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_E001", "예기치 않은 서버 에러가 발생했습니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
