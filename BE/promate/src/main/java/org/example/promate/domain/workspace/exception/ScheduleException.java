package org.example.promate.domain.workspace.exception;

import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.example.promate.global.ApiPayload.exception.GeneralException;

public class ScheduleException extends GeneralException {
    public ScheduleException(BaseErrorCode code){
        super(code);
    }
}
