package org.example.promate.domain.apply.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.example.promate.domain.apply.dto.ApplyFormResponse;
import org.example.promate.domain.apply.dto.ApplyRequest;
import org.example.promate.domain.apply.dto.ApplyResponse;
import org.example.promate.domain.apply.service.ApplyService;
import org.example.promate.domain.recruit.dto.response.RecruitCreateResponse;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.RecruitSuccessCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recruitments/{recruitmentsId}")
@RequiredArgsConstructor
public class ApplyController {

    private final ApplyService applyService;

    @GetMapping("application-form")
    public ResponseEntity<ApiResponse<ApplyFormResponse>> getApplyFormData(
            @PathVariable Long recruitmentsId
            //@AuthenticationPrincipal Long userId // 현재 로그인한 사용자 ID (Spring Security 가정)
    ) {
        ApplyFormResponse response = applyService.getApplyForm(recruitmentsId, 100L); //임시 userId를 100으로 가정

        return ResponseEntity
                .status(RecruitSuccessCode.APPLY_FORM_LOADED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.APPLY_FORM_LOADED, response));
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<ApplyResponse>> apply(
            @RequestBody @Valid ApplyRequest applyRequest,
            @PathVariable Long recruitmentsId
            //@AuthenticationPrincipal Long userId
    ) {
        ApplyResponse response = applyService.submit(recruitmentsId, 100L, applyRequest);
        return ResponseEntity
                .status(RecruitSuccessCode.APPLY_FORM_SUBMITTED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.APPLY_FORM_SUBMITTED, response));
    }
}