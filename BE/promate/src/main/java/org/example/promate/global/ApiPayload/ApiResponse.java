package org.example.promate.global.ApiPayload;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.example.promate.global.ApiPayload.code.BaseSuccessCode;

@AllArgsConstructor
@Getter
@JsonPropertyOrder({"isSuccess", "code", "message", "data"})
public class ApiResponse<T> {
    @JsonProperty("isSuccess")
    private final boolean isSuccess;

    @JsonProperty("code")
    private final String code;

    @JsonProperty("message")
    private final String message;

    @JsonProperty("data")
    private final T data;

    //success
    public static <T> ApiResponse<T> onSuccess(BaseSuccessCode code, T data){
        return new ApiResponse<>(true, code.getCode(), code.getMessage(), data);
    }

    //error
    public static <T> ApiResponse<T> onFailure(BaseErrorCode code, T data){
        return new ApiResponse<>(false, code.getCode(), code.getMessage(), data);
    }
}
