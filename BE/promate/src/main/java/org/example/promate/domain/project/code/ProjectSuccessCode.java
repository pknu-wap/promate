package org.example.promate.domain.project.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseSuccessCode;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ProjectSuccessCode implements BaseSuccessCode {

    MY_PROJECTS_FOUND(HttpStatus.OK, "PROJECT_S001", "내 프로젝트 목록 조회에 성공했습니다."),
    MY_APPLICATIONS_FOUND(HttpStatus.OK, "PROJECT_S002", "내 지원 현황 조회에 성공했습니다."),
    MY_ACTIVITIES_FOUND(HttpStatus.OK, "PROJECT_S003", "내 활동 이력 조회에 성공했습니다."),
    PROJECT_MEMBER_FOUND(HttpStatus.OK, "PROJECT_S004", "팀원 목록 조회에 성공했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}