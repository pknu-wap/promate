package org.example.promate.domain.workspace.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseSuccessCode;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum TaskSuccessCode implements BaseSuccessCode {
    TASK_GET_SUCCESS(HttpStatus.OK, "TASK_S001", "태스크 조회에 성공했습니다."),
    CREATED(HttpStatus.CREATED, "TASK_S002", "태스크 생성에 성공했습니다."),
    TASK_MODIFY_SUCCESS(HttpStatus.OK, "TASK_S003", "태스크 수정에 성공했습니다."),
    TASK_STATUS_UPDATE_SUCCESS(HttpStatus.OK, "TASK_S004", "태스크 상태 변경에 성공했습니다."),
    TASK_DELETE_SUCCESS(HttpStatus.OK, "TASK_S005", "태스크 삭제에 성공했습니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
