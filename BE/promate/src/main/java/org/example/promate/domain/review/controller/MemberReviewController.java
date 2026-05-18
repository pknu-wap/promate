package org.example.promate.domain.review.controller;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.review.code.ReviewSuccessCode;
import org.example.promate.domain.review.dto.MemberReviewDetailResponseDTO;
import org.example.promate.domain.review.dto.MemberReviewRequestDTO;
import org.example.promate.domain.review.dto.MemberReviewResponseDTO;
import org.example.promate.domain.review.service.MemberReviewService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects")
public class MemberReviewController {

    private final MemberReviewService memberReviewService;

    @PostMapping("/{projectId}/reviews")
    public ApiResponse<MemberReviewResponseDTO> createMemberReviews(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId,
            @RequestBody MemberReviewRequestDTO request
    ) {
        return ApiResponse.onSuccess(
                ReviewSuccessCode.REVIEW_CREATED,
                memberReviewService.createMemberReviews(userId, projectId, request)
        );
    }

    @GetMapping("/{projectId}/reviews/me")
    public ApiResponse<MemberReviewDetailResponseDTO> getMyReviews(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long projectId
    ) {
        return ApiResponse.onSuccess(
                ReviewSuccessCode.REVIEW_READ,
                memberReviewService.getMyReviews(userId, projectId)
        );
    }
}