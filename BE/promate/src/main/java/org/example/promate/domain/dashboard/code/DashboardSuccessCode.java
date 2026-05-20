package org.example.promate.domain.dashboard.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseSuccessCode;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum DashboardSuccessCode implements BaseSuccessCode {

    GET_ACTIVE_PROJECTS_SUCCESS(HttpStatus.OK, "DASHBOARD_S001", "참여중인 프로젝트 조회에 성공했습니다."),
    GET_DEADLINE_TASKS_SUCCESS(HttpStatus.OK, "DASHBOARD_S002", "마감임박 태스크 조회에 성공했습니다."),
    GET_COMPLETED_TASKS_SUCCESS(HttpStatus.OK, "DASHBOARD_S003", "완료된 태스크 조회에 성공했습니다."),
    GET_CALENDAR_SUCCESS(HttpStatus.OK, "DASHBOARD_S004", "캘린더 조회에 성공했습니다."),
    GET_PROJECT_STATUS_SUCCESS(HttpStatus.OK, "DASHBOARD_S005", "프로젝트 현황 조회에 성공했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

}