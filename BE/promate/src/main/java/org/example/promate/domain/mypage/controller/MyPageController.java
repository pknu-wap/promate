package org.example.promate.domain.mypage.controller;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.mypage.dto.MyActivityResponseDTO;
import org.example.promate.domain.mypage.dto.MyApplicationResponseDTO;
import org.example.promate.domain.mypage.dto.MyProjectResponseDTO;
import org.example.promate.domain.mypage.dto.MyRecruitResponseDTO;
import org.example.promate.domain.mypage.service.MyPageService;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.GeneralSuccessCode;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage")
public class MyPageController {

private final MyPageService myPageService;

@GetMapping("/applications/me")
public ApiResponse<List<MyApplicationResponseDTO>> getMyApplications(
        @AuthenticationPrincipal Long userId
) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                myPageService.getMyApplications(userId)
        );
}

@GetMapping("/projects/me")
public ApiResponse<List<MyProjectResponseDTO>> getMyProjects(
        @AuthenticationPrincipal Long userId
) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                myPageService.getMyProjects(userId)
        );
}

@GetMapping("/activity/me")
public ApiResponse<List<MyActivityResponseDTO>> getMyActivities(
        @AuthenticationPrincipal Long userId
) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                myPageService.getMyActivities(userId)
        );
}

@GetMapping("/recruits/me")
public ApiResponse<List<MyRecruitResponseDTO>> getMyRecruits(
        @AuthenticationPrincipal Long userId
) {
        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                myPageService.getMyRecruits(userId)
        );
}


}
