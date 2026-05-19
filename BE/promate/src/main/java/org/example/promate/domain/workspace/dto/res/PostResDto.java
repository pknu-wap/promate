package org.example.promate.domain.workspace.dto.res;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;
import org.example.promate.domain.workspace.enums.PostType;

import java.time.LocalDateTime;
import java.util.List;

public class PostResDto {

    @Builder
    @Getter
    @JsonPropertyOrder({"postId", "title", "createdAt"})
    public static class CreatedPostDto{
        Long postId;
        String title;
        LocalDateTime createdAt;
    }

    @Builder
    @Getter
    @JsonPropertyOrder({"postId", "updatedAt"})
    public static class UpdatedPostDto{
        Long postId;
        LocalDateTime updatedAt;
    }

    @Builder
    @Getter
    @JsonPropertyOrder({"postId", "deletedAt"})
    public static class DeletedPostDto{
        Long postId;
        LocalDateTime deletedAt;
    }

    @Builder
    @Getter
    @JsonPropertyOrder({"postId", "postType", "title", "content", "writerName", "createdAt", "updatedAt"})
    public static class PostDto{
        Long postId;
        PostType postType;
        String title;
        String content;
        String writerName;
        LocalDateTime createdAt;
        LocalDateTime updatedAt;
    }

    @Builder
    @Getter
    @JsonPropertyOrder
    public static class PostListDto{
        List<PostDto> postList;

    }
}