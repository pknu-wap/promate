package org.example.promate.global.auth.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.GeneralSuccessCode;
import org.example.promate.global.auth.dto.KakaoAuthResponseDTO;
import org.example.promate.global.auth.dto.LogoutRequestDTO;
import org.example.promate.global.auth.dto.TokenReissueRequestDTO;
import org.example.promate.global.auth.service.KakaoAuthService;
import org.example.promate.global.jwt.JwtTokenDto;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth/kakao")
public class KakaoAuthController {
    private final KakaoAuthService kakaoAuthService;

    @GetMapping("/login")
    public ApiResponse<Map<String, String>> getKakaoUrl(HttpSession httpSession) {

        String url = kakaoAuthService.setKakaoAuthUrl(httpSession);

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                Map.of("url", url)
        );
    }

    @GetMapping("/callback")
    public ApiResponse<KakaoAuthResponseDTO> kakaoCallBack(
            @RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state,
            HttpSession httpSession) {

        KakaoAuthResponseDTO response = kakaoAuthService.kakaoLogin(code, state, httpSession);

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                response
        );
    }

    @PostMapping("/reissue")
    public ApiResponse<JwtTokenDto> reissue(@RequestBody TokenReissueRequestDTO request) {
        JwtTokenDto token = kakaoAuthService.reissueToken(request.getRefreshToken());

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                token
        );
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequestDTO request) {
        kakaoAuthService.logout(request.getRefreshToken());

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                null
        );
    }
}

