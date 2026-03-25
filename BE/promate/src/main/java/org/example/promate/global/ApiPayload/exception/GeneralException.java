package org.example.promate.global.ApiPayload.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseErrorCode;

@AllArgsConstructor
@Getter
public class GeneralException extends RuntimeException{
    private final BaseErrorCode code;
}
