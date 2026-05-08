package org.example.promate.global.auth.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.promate.global.ApiPayload.ApiResponse;
import org.example.promate.global.ApiPayload.code.GeneralSuccessCode;
import org.example.promate.global.auth.dto.KakaoAuthResponseDTO;
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
            HttpSession httpSession,
            HttpServletResponse response
    ) {
        KakaoAuthResponseDTO authResponse =
                kakaoAuthService.kakaoLogin(code, state, httpSession);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(60 * 60 * 24 * 14)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                authResponse
        );

    }

    @PostMapping("/reissue")
    public ApiResponse<TokenReissueResponseDTO> reissue(
            @CookieValue(value = "refreshToken", required = false)
            String refreshToken,

            HttpServletResponse response
    ) {

        boolean profileCompleted =
                kakaoAuthService.getProfileCompletedByRefreshToken(refreshToken);

        JwtTokenDto token = kakaoAuthService.reissueToken(refreshToken);

        ResponseCookie refreshCookie = ResponseCookie.from(
                        "refreshToken",
                        token.refreshToken()
                )
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(60 * 60 * 24 * 14)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                new TokenReissueResponseDTO(token.accessToken(), profileCompleted)
        );
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        kakaoAuthService.logout(refreshToken);

        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

        return ApiResponse.onSuccess(
                GeneralSuccessCode.OK,
                null
        );
    }
}

