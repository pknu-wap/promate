package org.example.promate.domain.workspace.controller.api;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.workspace.code.PostSuccessCode;
import org.example.promate.domain.workspace.controller.docs.PostControllerDocs;
import org.example.promate.domain.workspace.dto.req.PostReqDto;
import org.example.promate.domain.workspace.dto.res.PostResDto;
import org.example.promate.domain.workspace.enums.PostType;
import org.example.promate.domain.workspace.service.command.PostCommandService;
import org.example.promate.domain.workspace.service.query.PostQueryService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects/{projectId}/posts")
public class PostController implements PostControllerDocs {
    private final PostCommandService postCommandService;
    private final PostQueryService postQueryService;

    // 게시글 작성하기
    @PostMapping()
    public ApiResponse<PostResDto.CreatedPostDto> createPost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @RequestBody PostReqDto.CreatePostDto dto
    ) {
        return ApiResponse.onSuccess(PostSuccessCode.CREATED, postCommandService.createPost(userId, projectId, dto));
    }

    // 게시글 수정하기
    @PutMapping("/{postId}")
    public ApiResponse<PostResDto.UpdatedPostDto> updatePost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long postId,
            @RequestBody PostReqDto.UpdatePostDto dto
    ){
        return ApiResponse.onSuccess(PostSuccessCode.UPDATE_SUCCESS, postCommandService.updatePost(userId, projectId, postId, dto));
    }

    // 게시글 삭제하기
    @DeleteMapping("/{postId}")
    public ApiResponse<PostResDto.DeletedPostDto> deletePost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long postId
    ){
        return ApiResponse.onSuccess(PostSuccessCode.DELETE_SUCCESS, postCommandService.deletePost(userId, projectId, postId));
    }

    // 게시글 단건 조회
    @GetMapping("/{postId}")
    public ApiResponse<PostResDto.PostDto> getPost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long postId
    ){
        return ApiResponse.onSuccess(PostSuccessCode.OK, postQueryService.getPost(userId, projectId, postId));
    }

    // 게시글 목록 조회
    @GetMapping()
    public ApiResponse<PostResDto.PostListDto> getAllPostByType(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @RequestParam(name = "type", required = false) PostType postType
    ){
        return ApiResponse.onSuccess(PostSuccessCode.LIST_OK, postQueryService.getAllPostByType(userId, projectId, postType));
    }

}
