package org.example.promate.global.ApiPayload.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum RecruitSuccessCode implements BaseSuccessCode{

    RECRUITMENT_CREATED(HttpStatus.CREATED, "RECRUIT_S001", "팀 모집 게시글 발행을 성공했습니다."),
    RECRUITMENT_FOUND(HttpStatus.OK, "RECRUIT_S002", "팀 모집글 상세 조회를 성공했습니다."),
    RECRUITMENT_UPDATED(HttpStatus.OK, "RECRUIT_S003", "팀 모집글 수정을 성공했습니다 ."),
    RECRUITMENT_DELETED(HttpStatus.NO_CONTENT, "RECRUIT_S004", "팀 모집글 삭제를 성공했습니다 ."),
    RECRUITMENT_FILTERED(HttpStatus.NO_CONTENT, "RECRUIT_S005", "팀 모집글 필터링을 성공했습니다 ."),

    APPLY_FORM_LOADED(HttpStatus.OK, "RECRUIT_S006", "팀 지원글 작성 페이지 불러오기를 성공했습니다."),
    APPLY_FORM_SUBMITTED(HttpStatus.OK, "RECRUIT_S007", "팀 지원글 발행을 성공했습니다."),
    APPLY_FORM_UPDATED(HttpStatus.OK, "RECRUIT_S008", "팀 지원글 수정을 성공했습니다."),
    APPLY_FORM_DELETED(HttpStatus.NO_CONTENT, "RECRUIT_S009", "팀 지원글 삭제를 성공했습니다."),

    APPLY_LIST_FETCHED(HttpStatus.OK,"RECRUIT_S010", "팀 지원서 리스트 불러오기를 성공했습니다."),
    APPLY_DETAIL_FETCHED(HttpStatus.OK, "RECRUIT_S011", "팀 지원서 상세 조회를 성공했습니다."),
    APPLY_STATUS_UPDATED(HttpStatus.OK, "RECRUIT_S012", "팀 모집이 완료되었습니다.")
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
