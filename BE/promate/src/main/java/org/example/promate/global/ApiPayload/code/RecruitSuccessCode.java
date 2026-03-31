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
    RECRUITMENT_DELETED(HttpStatus.NO_CONTENT, "RECRUIT_S004", "팀 모집글 삭제를 성공했습니다 .")
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
