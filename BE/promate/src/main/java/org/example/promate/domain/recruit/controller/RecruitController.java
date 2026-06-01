package org.example.promate.domain.recruit.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.recruit.dto.request.RecruitCreateRequest;
import org.example.promate.domain.recruit.dto.request.RecruitSearchCondition;
import org.example.promate.domain.recruit.dto.request.RecruitStatusRequest;
import org.example.promate.domain.recruit.dto.request.RecruitUpdateRequest;
import org.example.promate.domain.recruit.dto.response.*;
import org.example.promate.domain.recruit.service.RecruitService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.domain.recruit.code.RecruitSuccessCode;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@ResponseBody
@RequiredArgsConstructor
@RequestMapping("/recruitments")
public class RecruitController {

    private final RecruitService recruitService;

    @PostMapping
    public ResponseEntity<ApiResponse<RecruitCreateResponse>> create(
            @Valid @RequestBody RecruitCreateRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        RecruitCreateResponse response = recruitService.createRecruitment(request, userId);

        return ResponseEntity
                .status(RecruitSuccessCode.RECRUITMENT_CREATED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_CREATED, response));
    }

    @GetMapping("/{recruitmentId}")
    public ResponseEntity<ApiResponse<RecruitDetailResponse>> detail(
            @PathVariable Long recruitmentId,
            @AuthenticationPrincipal Long userId
    ) {
        RecruitDetailResponse response = recruitService.getRecruitmentDetail(recruitmentId,userId);

        return ResponseEntity
                .status(RecruitSuccessCode.RECRUITMENT_FOUND.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_FOUND, response));
    }

    @PutMapping("/{recruitmentId}")
    public ResponseEntity<ApiResponse<Void>> update(
            @PathVariable Long recruitmentId,
            @Valid @RequestBody RecruitUpdateRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        recruitService.updateRecruitment(recruitmentId,request,userId);

        return ResponseEntity
                .status(RecruitSuccessCode.RECRUITMENT_UPDATED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_UPDATED,null));
    }

    @DeleteMapping("/{recruitmentId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long recruitmentId,
            @AuthenticationPrincipal Long userId
    ) {
    //지원서 발행 시 생성된 임시 프로젝트와 그에 매핑된 임시 멤버는 지원서 삭제시 같이 제거되도록
        recruitService.deleteRecruitment(recruitmentId,userId);

        return ResponseEntity
                .status(RecruitSuccessCode.RECRUITMENT_DELETED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_DELETED,null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<RecruitPageResponse<RecruitResponse>>> getRecruitList(
            @ModelAttribute RecruitSearchCondition condition,
            @AuthenticationPrincipal Long userId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        RecruitPageResponse<RecruitResponse> response = recruitService.getRecruitments(condition, pageable,userId);

        return ResponseEntity
                .status(RecruitSuccessCode.RECRUITMENT_FILTERED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_FILTERED,response));
    }


    @PatchMapping("/{recruitmentId}/status")
    public ApiResponse<RecruitStatusResponse> completeRecruitment(
            @PathVariable Long recruitmentId,
            @RequestBody @Valid RecruitStatusRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        RecruitStatusResponse response = recruitService.changeRecruitStatus(recruitmentId, userId, request);
        return ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_COMPLETED, response);
    }

    @PostMapping("/{recruitmentId}/bookmark")
    public ApiResponse<BookmarkResponse> toggleBookmark(
            @PathVariable Long recruitmentId,
            @AuthenticationPrincipal Long userId
    ) {
        BookmarkResponse data = recruitService.toggleBookmark(recruitmentId, userId);
        return ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_BOOKMARKED,data);
    }

    @GetMapping("/bookmark")
    public ApiResponse<RecruitPageResponse<RecruitResponse>> getBookmarkList(
            @AuthenticationPrincipal Long userId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    )
    {
        RecruitPageResponse<RecruitResponse> response = recruitService.getBookmarkedRecruitments(userId, pageable);
        return ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_BOOKMARKED_LIST_FETCHED,response);
    }

    @GetMapping("/me")
    public ApiResponse<RecruitPageResponse<MyRecruitResponse>> getMyRecruitments(
            @AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        RecruitPageResponse<MyRecruitResponse> response = recruitService.getMyRecruitments(userId,pageable);

        return ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_BOOKMARKED_LIST_FETCHED,response);
    }

    @GetMapping("/{recruitmentId}/leader-profile")
    public ApiResponse<RecruitLeaderProfileResponse> getRecruitLeaderProfile(
            @PathVariable Long recruitmentId
    ) {
        return ApiResponse.onSuccess(
                RecruitSuccessCode.RECRUIT_LEADER_PROFILE_FOUND,
                recruitService.getRecruitLeaderProfile(recruitmentId)
        );
    }
}
