package org.example.promate.domain.recruit.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.recruit.dto.request.RecruitCreateRequest;
import org.example.promate.domain.recruit.dto.request.RecruitUpdateRequest;
import org.example.promate.domain.recruit.dto.response.RecruitCreateResponse;
import org.example.promate.domain.recruit.dto.response.RecruitDetailResponse;
import org.example.promate.domain.recruit.service.RecruitService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.GeneralSuccessCode;
import org.example.promate.global.ApiPayload.code.RecruitSuccessCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@ResponseBody
@RequiredArgsConstructor
@RequestMapping("/recruitments")
public class RecruitController {

    private final RecruitService recruitService;
    // TODO: User 도메인 병합 후 연동 예정
    // Long userId = user.getId();
    Long userId = 1L; // 테스트용 임시 ID

    @PostMapping
    public ResponseEntity<ApiResponse<RecruitCreateResponse>> create(
            @Valid @RequestBody RecruitCreateRequest request
            //@AuthenticationPrincipal CustomUser user
    ) {
        RecruitCreateResponse response = recruitService.createRecruitment(request, userId);

        return ResponseEntity
                .status(RecruitSuccessCode.RECRUITMENT_CREATED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_CREATED, response));
    }

    @GetMapping("/{recruitmentId}")
    public ResponseEntity<ApiResponse<RecruitDetailResponse>> detail(
            @PathVariable Long recruitmentId
            //@AuthenticationPrincipal CustomUser user
    ) {
        RecruitDetailResponse response = recruitService.getRecruitmentDetail(recruitmentId,userId);

        return ResponseEntity
                .status(RecruitSuccessCode.RECRUITMENT_FOUND.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_FOUND, response));
    }

    @PutMapping("/{recruitmentId}")
    public ResponseEntity<ApiResponse<Void>> update(
            @PathVariable Long recruitmentId,
            @Valid @RequestBody RecruitUpdateRequest request
            //@AuthenticationPrincipal CustomUser user
    ) {
        recruitService.updateRecruitment(recruitmentId,request,userId);

        return ResponseEntity
                .status(RecruitSuccessCode.RECRUITMENT_UPDATED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_UPDATED,null));
    }

    @DeleteMapping("/{recruitmentId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long recruitmentId
            //@AuthenticationPrincipal CustomUser user
    ) {
        recruitService.deleteRecruitment(recruitmentId,userId);

        return ResponseEntity
                .status(RecruitSuccessCode.RECRUITMENT_DELETED.getStatus())
                .body(ApiResponse.onSuccess(RecruitSuccessCode.RECRUITMENT_DELETED,null));
    }
}
