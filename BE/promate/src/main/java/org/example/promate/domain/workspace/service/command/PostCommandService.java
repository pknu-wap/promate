package org.example.promate.domain.workspace.service.command;

import org.example.promate.domain.workspace.dto.req.PostReqDto;
import org.example.promate.domain.workspace.dto.res.PostResDto;

public interface PostCommandService{
    PostResDto.CreatedPostDto createPost(Long userId, Long projectId, PostReqDto.CreatePostDto dto);
    PostResDto.UpdatedPostDto updatePost(Long userId, Long projectId, Long postId, PostReqDto.UpdatePostDto dto);
    PostResDto.DeletedPostDto deletePost(Long userId, Long projectId, Long postId);
}
