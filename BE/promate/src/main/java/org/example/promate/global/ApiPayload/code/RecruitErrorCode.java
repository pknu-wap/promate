package org.example.promate.global.ApiPayload.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum RecruitErrorCode implements BaseErrorCode {

    // 모집글 관련 (RECRUITMENT_XXX)
    RECRUITMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "RECRUIT_E001", "해당 모집 게시글을 찾을 수 없습니다."),
    NOT_RECRUITMENT_AUTHOR(HttpStatus.FORBIDDEN, "RECRUIT_E002", "해당 게시글의 수정/삭제 권한이 없습니다."),
    RECRUITMENT_ALREADY_CLOSED(HttpStatus.BAD_REQUEST, "RECRUIT_E003", "이미 모집이 완료된 게시글입니다."),
    INVALID_FILTER_CONDITION(HttpStatus.BAD_REQUEST, "RECRUIT_E004", "잘못된 필터링 조건입니다."),

    // 지원 관련 (APPLY_XXX)
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "RECRUIT_E005", "지원서를 찾을 수 없습니다."),
    ALREADY_APPLIED(HttpStatus.BAD_REQUEST, "RECRUIT_E006", "이미 해당 프로젝트에 지원한 이력이 있습니다."),
    SELF_APPLY_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "RECRUIT_E007", "본인이 작성한 모집글에는 지원할 수 없습니다."),
    RECRUITMENT_FULL(HttpStatus.BAD_REQUEST, "RECRUIT_E008", "모집 인원이 모두 찼습니다."),
    NOT_AUTHORIZED_LEADER(HttpStatus.FORBIDDEN, "RECRUIT_E009", "팀장만 지원자 목록 및 상세 정보를 조회할 수 있습니다."),
    NOT_APPLICATION_AUTHOR(HttpStatus.BAD_REQUEST, "RECRUIT_010", "지원글 작성자만 수정 및 삭제가 가능합니다.")
    ,

    // 프로젝트/멤버 관련
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "RECRUIT_E011", "해당 프로젝트의 멤버가 아닙니다."),
    INSUFFICIENT_PARTICIPANTS(HttpStatus.BAD_REQUEST, "RECRUIT_E012", "최소 참여 인원이 부족하여 모집을 완료할 수 없습니다."),
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, "RECRUIT_E013", "연결된 프로젝트 정보를 찾을 수 없습니다.")
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;

}