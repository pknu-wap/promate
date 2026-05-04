package org.example.promate.domain.apply.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.apply.dto.*;
import org.example.promate.domain.apply.service.ApplyService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.domain.recruit.code.RecruitSuccessCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recruitments/{recruitmentsId}")
@RequiredArgsConstructor
public class ApplyController {

    private final ApplyService applyService;

    @GetMapping("application-form")
    public ResponseEntity<ApiResponse<ApplyFormResponse>> getApplyFormData(
            @PathVariable Long recruitmentsId,
            @AuthenticationPrincipal Long userId
    ) {
        ApplyFormResponse response = applyService.getApplyForm(recruitmentsId, userId);

        return ResponseEntity
                .status(RecruitSuccessCode.APPLY_FORM_LOADED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.APPLY_FORM_LOADED, response));
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<ApplyResponse>> apply(
            @RequestBody @Valid ApplyRequest applyRequest,
            @PathVariable Long recruitmentsId,
            @AuthenticationPrincipal Long userId
    ) {
        ApplyResponse response = applyService.submit(recruitmentsId, userId, applyRequest);
        return ResponseEntity
                .status(RecruitSuccessCode.APPLY_FORM_SUBMITTED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.APPLY_FORM_SUBMITTED, response));
    }

    @PostMapping("/applications/{applicationId}")
    public ApiResponse<ApplicationUpdateResponse> updateApplication(
            @PathVariable Long applicationId,
            @PathVariable Long recruitmentsId,
            @RequestBody @Valid ApplicationUpdateRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        ApplicationUpdateResponse response = applyService.updateApplication(recruitmentsId,applicationId,userId, request);
        return ApiResponse.onSuccess(RecruitSuccessCode.APPLY_FORM_UPDATED, response);
    }

    //지원 취소(이미 합격된 경우 취소는 추가적 로직을 수행하도록 함)
    @DeleteMapping("/applications/{applicationId}")
    public ApiResponse<Void> cancelApply(
            @PathVariable Long applicationId,
            @PathVariable Long recruitmentsId,
            @AuthenticationPrincipal Long userId
    ) {
        applyService.deleteApplication(recruitmentsId,applicationId,userId);
        return ApiResponse.onSuccess(RecruitSuccessCode.APPLY_FORM_DELETED,null);
    }


    @GetMapping("/applications")
    public ApiResponse<ApplicantListResponse> getApplicants(
            @PathVariable Long recruitmentsId,
            @AuthenticationPrincipal Long userId // 현재 로그인한 팀장
    ) {
        return ApiResponse.onSuccess(
                RecruitSuccessCode.APPLY_LIST_FETCHED,
                applyService.getApplicantList(recruitmentsId, userId)
        );
    }

    @GetMapping("/applications/{applicationId}")
    public ApiResponse<ApplicationDetailResponse> getApplicationDetail(
            @PathVariable Long recruitmentsId,
            @PathVariable Long applicationId,
            @AuthenticationPrincipal Long userId
    ) {
        return ApiResponse.onSuccess(
                RecruitSuccessCode.APPLY_DETAIL_FETCHED,
                applyService.getApplicationDetail(recruitmentsId, applicationId, userId)
        );
    }

    //모집 지원자 합격/불합격 (+status 변겅을 통한 기존 합격자 퇴출시키기)
    @PatchMapping("/applications/{applicationId}/status")
    public ApiResponse<ApplyStatusResponse> updateApplyStatus(
            @PathVariable Long recruitmentsId,
            @PathVariable Long applicationId,
            @RequestBody @Valid ApplyStatusRequest request,
            @AuthenticationPrincipal Long userId // 팀장 ID
    ) {
        ApplyStatusResponse response = applyService.handleApplicationStatus(recruitmentsId, applicationId, userId, request);
        return ApiResponse.onSuccess(RecruitSuccessCode.APPLY_STATUS_UPDATED, response);
    }
}