package org.example.promate.domain.user.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseSuccessCode;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum UserSuccessCode implements BaseSuccessCode {

    GET_USER_SUCCESS(HttpStatus.OK, "USER_S001", "회원 정보 조회에 성공했습니다."),
    UPDATE_USER_SUCCESS(HttpStatus.OK, "USER_S002", "프로필 수정에 성공했습니다."),

    GET_PROJECT_HISTORY_SUCCESS(HttpStatus.OK, "USER_S003", "프로젝트 이력 조회에 성공했습니다."),
    CREATE_PROJECT_HISTORY_SUCCESS(HttpStatus.OK, "USER_S004", "프로젝트 이력 등록에 성공했습니다."),
    UPDATE_PROJECT_HISTORY_SUCCESS(HttpStatus.OK, "USER_S005", "프로젝트 이력 수정에 성공했습니다."),
    DELETE_PROJECT_HISTORY_SUCCESS(HttpStatus.OK, "USER_S006", "프로젝트 이력 삭제에 성공했습니다."),

    GET_PROJECT_TASK_COUNT_SUCCESS(HttpStatus.OK, "USER_S007", "프로젝트별 태스크 개수 조회에 성공했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}