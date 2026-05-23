package org.example.promate.domain.workspace.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseErrorCode;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum PostErrorCode implements BaseErrorCode {
    POST_NOT_FOUND_IN_PROJECT(HttpStatus.NOT_FOUND, "POST_E001", "해당 프로젝트의 게시글이 아닙니다."),
    ONLY_WRITER_ACCESS_UPDATE(HttpStatus.FORBIDDEN, "POST_E002", "게시글 작성자만 수정 가능합니다."),
    ONLY_WRITER_ACCESS_DELETE(HttpStatus.FORBIDDEN, "POST_E003", "게시글 작성자만 삭제 가능합니다."),
    NOT_FOUND_BY_POST_ID(HttpStatus.NOT_FOUND, "POST_E004", "게시글을 찾을 수 없습니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
