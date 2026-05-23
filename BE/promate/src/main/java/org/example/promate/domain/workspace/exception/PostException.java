package org.example.promate.domain.workspace.exception;

import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.example.promate.global.ApiPayload.exception.GeneralException;

public class PostException extends GeneralException {
    public PostException(BaseErrorCode code){
        super(code);
    }
}