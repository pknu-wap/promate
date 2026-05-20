package org.example.promate.domain.workspace.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseSuccessCode;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum PostSuccessCode implements BaseSuccessCode {
    CREATED(HttpStatus.CREATED, "POST_S001", "게시글 생성에 성공했습니다."),
    UPDATE_SUCCESS(HttpStatus.OK, "POST_S002", "게시글 수정에 성공했습니다."),
    DELETE_SUCCESS(HttpStatus.OK, "POST_S003", "게시글 삭제에 성공했습니다."),
    OK(HttpStatus.OK, "POST_S004", "게시글 단건 조회에 성공했습니다."),
    LIST_OK(HttpStatus.OK, "POST_S005", "게시글 목록 조회에 성공했씁니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
