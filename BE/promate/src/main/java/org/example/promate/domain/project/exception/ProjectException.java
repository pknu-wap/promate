package org.example.promate.domain.project.exception;

import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.example.promate.global.ApiPayload.exception.GeneralException;

public class ProjectException extends GeneralException {
    public ProjectException(BaseErrorCode code){
        super(code);
    }
}
