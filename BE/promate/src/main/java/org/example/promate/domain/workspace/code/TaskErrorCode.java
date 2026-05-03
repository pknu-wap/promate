package org.example.promate.domain.workspace.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum TaskErrorCode implements BaseErrorCode {
    ID_NOT_FOUND(HttpStatus.NOT_FOUND, "TASK_E001", "해당 태스크를 찾을 수 없습니다."),
    NOT_PROJECT_TASK(HttpStatus.FORBIDDEN, "TASK_E002", "해당 프로젝트의 사용자만 접근 가능합니다."),
    EMPTY_PROJECT_TASKS(HttpStatus.NOT_FOUND, "TASK_E003", "해당 프로젝트에 할당된 태스크를 찾을 수 없어 진행률을 계산할 수 없습니다."),
    NOT_ASSIGNEE_OR_PROJECT_LEADER(HttpStatus.FORBIDDEN, "TASK_E004", "태스크 담당자나 프로젝트 리더만 수정 가능합니다."),
    NOT_ASSIGNEE(HttpStatus.FORBIDDEN, "TASK_E004", "태스크 담당자만 상태 변경이 가능합니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
