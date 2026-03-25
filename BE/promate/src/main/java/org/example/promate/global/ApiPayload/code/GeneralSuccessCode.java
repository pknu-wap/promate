package org.example.promate.global.ApiPayload.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GeneralSuccessCode implements BaseSuccessCode{
    OK(HttpStatus.OK, "COMMON_S001", "요청을 성공적으로 처리했습니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
