package org.example.promate.domain.workspace.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ScheduleErrorCode implements BaseErrorCode {
    ID_NOT_FOUND(HttpStatus.NOT_FOUND, "SCHEDULE_E001", "해당 일정을 찾을 수 없습니다."),
    ALREADY_DELETED_SCHEDULE(HttpStatus.BAD_REQUEST, "SCHEDULE_E002", "이미 삭제된 일정입니다."),
    ;


    private final HttpStatus status;
    private final String code;
    private final String message;
}
