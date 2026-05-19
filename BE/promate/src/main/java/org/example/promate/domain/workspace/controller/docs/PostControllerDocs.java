package org.example.promate.domain.workspace.controller.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.promate.domain.workspace.code.PostSuccessCode;
import org.example.promate.domain.workspace.dto.req.PostReqDto;
import org.example.promate.domain.workspace.dto.req.ScheduleReqDto;
import org.example.promate.domain.workspace.dto.res.PostResDto;
import org.example.promate.domain.workspace.dto.res.ScheduleResDto;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@Tag(name = "WORKSPACE_POST", description = "WORKSPACE 도메인 내 팀 게시판 관리 API")
public interface PostControllerDocs {

    // 게시글 생성하기
    @Operation(
            summary = "POST_01 게시글 생성하기",
            operationId = "WORKSPACE_POST_01",
            description = "게시판 내의 NOTICE, GENERAL 타입의 게시글을 생성합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "게시글 생성 성공 (POST_S001)",
                    content = @Content(schema = @Schema(implementation = PostResDto.CreatedPostDto.class))
            )
    })
    @PostMapping("/projects/{projectId}")
    ApiResponse<PostResDto.CreatedPostDto> createPost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @RequestBody PostReqDto.CreatePostDto dto
    );

    // 게시글 수정하기
    @Operation(
            summary = "POST_02 게시글 수정하기",
            operationId = "WORKSPACE_POST_02",
            description = "게시글을 수정합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "게시글 수정 성공 (POST_S002)",
                    content = @Content(schema = @Schema(implementation = PostResDto.UpdatedPostDto.class))
            )
    })
    @PutMapping("/projects/{projectId}/{postId}")
    ApiResponse<PostResDto.UpdatedPostDto> updatePost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long postId,
            @RequestBody PostReqDto.UpdatePostDto dto
    );

    // 게시글 삭제하기
    @Operation(
            summary = "POST_03 게시글 삭제하기",
            operationId = "WORKSPACE_POST_03",
            description = "게시글을 삭제합니다.(SOFT DELETE)"
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "게시글 삭제 성공 (POST_S003)",
                    content = @Content(schema = @Schema(implementation = PostResDto.DeletedPostDto.class))
            )
    })
    @DeleteMapping("/projects/{projectId}/{postId}")
    ApiResponse<PostResDto.DeletedPostDto> deletePost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long postId
    );

    // 게시글 단건 조회
    @Operation(
            summary = "POST_04 게시글 조회하기",
            operationId = "WORKSPACE_POST_04",
            description = "게시글 상세 페이지를 위한 단건 게시글을 조회합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "게시글 조회 성공 (POST_S004)",
                    content = @Content(schema = @Schema(implementation = PostResDto.PostDto.class))
            )
    })
    @GetMapping("/projects/{projectId}/{postId}")
    ApiResponse<PostResDto.PostDto> getPost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @PathVariable Long postId
    );

    // 게시글 목록 조회
    @Operation(
            summary = "POST_05 게시글 목록 조회하기",
            operationId = "WORKSPACE_POST_05",
            description = "게시글의 목록을 조회합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "게시글 조회 성공 (POST_S005)",
                    content = @Content(schema = @Schema(implementation = PostResDto.PostListDto.class))
            )
    })
    @GetMapping("/projects/{projectId}")
    ApiResponse<PostResDto.PostListDto> getAllPost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId
    );
}