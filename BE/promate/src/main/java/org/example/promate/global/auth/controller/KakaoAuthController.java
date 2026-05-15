package org.example.promate.global.auth.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.GeneralSuccessCode;
import org.example.promate.global.auth.dto.KakaoAuthResponseDTO;
import org.example.promate.global.auth.dto.LogoutRequestDTO;
import org.example.promate.global.auth.dto.TokenReissueResponseDTO;
import org.example.promate.global.auth.service.KakaoAuthService;
import org.example.promate.global.jwt.JwtTokenDto;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth/kakao")
public class KakaoAuthController {

    private final KakaoAuthService kakaoAuthService;

    @GetMapping("/login")
    public ApiResponse<Map<String, String>> getKakaoUrl() {

        String url = kakaoAuthService.setKakaoAuthUrl();

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                Map.of("url", url)
        );
    }

    @GetMapping("/callback")
    public ApiResponse<KakaoAuthResponseDTO> kakaoCallBack(
            @RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state
    ) {
        KakaoAuthResponseDTO authResponse =
                kakaoAuthService.kakaoLogin(code, state);

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                authResponse
        );
    }

    @PostMapping("/reissue")
    public ApiResponse<TokenReissueResponseDTO> reissue(
            @RequestBody LogoutRequestDTO request
    ) {
        JwtTokenDto token = kakaoAuthService.reissueToken(request.getRefreshToken());

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                TokenReissueResponseDTO.builder()
                        .accessToken(token.accessToken())
                        .refreshToken(token.refreshToken())
                        .build()
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

