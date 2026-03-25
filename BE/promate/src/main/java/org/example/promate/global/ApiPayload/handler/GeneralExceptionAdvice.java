package org.example.promate.global.ApiPayload.handler;

import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.GeneralErrorCode;
import org.example.promate.global.ApiPayload.exception.GeneralException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice   //모든 예외 처리-이 클래스가 있어야 GeneralException 동작
public class GeneralExceptionAdvice {

    //커스텀(GeneralException을 상속받은 예외 클래스) 예외 처리
    @ExceptionHandler(GeneralException.class)
    public ResponseEntity<ApiResponse<Void>> handlerException(GeneralException ex){
        return ResponseEntity
                .status(ex.getCode().getStatus())
                .body(ApiResponse.onFailure(ex.getCode(), null));
    }

    //예상치 못한 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handlerException(Exception ex){
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.onFailure(GeneralErrorCode.INTERNAL_SERVER_ERROR, ex.getMessage()));
    }

}