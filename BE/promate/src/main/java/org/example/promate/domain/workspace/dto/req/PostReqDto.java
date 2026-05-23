package org.example.promate.domain.workspace.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.domain.workspace.enums.PostType;

public class PostReqDto {

    @Getter
    @AllArgsConstructor
    public static class CreatePostDto{
        @NotBlank
        private String title;

        @NotBlank
        private String content;

        @NotBlank
        private PostType postType;
    }

    @Getter
    @AllArgsConstructor
    public static class UpdatePostDto{
        @NotBlank
        private String title;

        @NotBlank
        private String content;

        @NotBlank
        private PostType postType;
    }
}
