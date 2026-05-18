package org.example.promate.domain.review.code;

import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseSuccessCode;
import org.springframework.http.HttpStatus;

@Getter
public enum ReviewSuccessCode implements BaseSuccessCode {

    REVIEW_CREATED(HttpStatus.CREATED, "REVIEW_S001", "팀원 평가가 등록되었습니다."),

    REVIEW_READ(HttpStatus.OK,"REVIEW_S002","팀원 평가 조회에 성공했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

    ReviewSuccessCode(
            HttpStatus status,
            String code,
            String message
    ) {
        this.status = status;
        this.code = code;
        this.message = message;
    }


}