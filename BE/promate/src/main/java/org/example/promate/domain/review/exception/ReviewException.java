package org.example.promate.domain.review.exception;

import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseErrorCode;

@Getter
public class ReviewException extends RuntimeException {

    private final BaseErrorCode errorCode;

    public ReviewException(BaseErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}