package org.example.promate.domain.workspace.converter;

import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.workspace.dto.req.PostReqDto;
import org.example.promate.domain.workspace.dto.res.PostResDto;
import org.example.promate.domain.workspace.entity.Post;
import org.example.promate.domain.workspace.enums.PostType;

import java.time.LocalDateTime;
import java.util.List;

public class PostConverter {
    public static Post toEntity(PostReqDto.CreatePostDto dto, Member member, Project project){
        return Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .postType(dto.getPostType())
                .member(member)
                .project(project)
                .build();
    }

    public static PostResDto.CreatedPostDto toCreatedPostDto(Post post){
        return PostResDto.CreatedPostDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .createdAt(post.getCreatedAt())
                .build();
    }

    public static PostResDto.UpdatedPostDto toUpdatedPostDto(Post post){
        return PostResDto.UpdatedPostDto.builder()
                .postId(post.getId())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public static PostResDto.DeletedPostDto toDeletedPostDto(Post post){
        return PostResDto.DeletedPostDto.builder()
                .postId(post.getId())
                .deletedAt(post.getDeletedAt())
                .build();
    }

    public static PostResDto.PostDto toPostDto(Post post){
        return PostResDto.PostDto.builder()
                .postId(post.getId())
                .postType(post.getPostType())
                .title(post.getTitle())
                .content(post.getContent())
                .writerName(post.getMember().getUser().getName())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public static PostResDto.PostListDto toPostListDto(List<Post> posts){
        return PostResDto.PostListDto.builder()
                .postList(posts.stream()
                        .map(PostConverter::toPostDto)
                        .toList())
                .build();
    }
}
