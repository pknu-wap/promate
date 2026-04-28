package org.example.promate.domain.workspace.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseSuccessCode;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ScheduleSuccessCode implements BaseSuccessCode {
    CREATED(HttpStatus.CREATED, "SCHEDULE_S001", "팀 일정이 성공적으로 등록되었습니다."),
    OK(HttpStatus.OK, "SCHEDULE_S002", "팀 일정 조회에 성공했습니다."),
    DETAILS_OK(HttpStatus.OK, "SCHEDULE_S003", "일정 상세 조회가 완료되었습니다."),
    MODIFY_SUCCESS(HttpStatus.OK, "SCHEDULE_S004", "일정 수정이 완료되었습니다."),
    DELETE_SUCCESS(HttpStatus.OK, "SCHEDULE_S005", "일정 삭제가 완료되었습니다.")
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
