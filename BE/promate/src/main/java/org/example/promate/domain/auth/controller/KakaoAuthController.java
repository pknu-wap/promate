package org.example.promate.domain.auth.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.auth.dto.KakaoAuthResponseDTO;
import org.example.promate.domain.auth.dto.LogoutRequestDTO;
import org.example.promate.domain.auth.dto.TokenReissueRequestDTO;
import org.example.promate.domain.auth.service.KakaoAuthService;
import org.example.promate.global.jwt.JwtTokenDto;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth/kakao")
public class KakaoAuthController {
    private final KakaoAuthService kakaoAuthService;

    @GetMapping("/login")
    public String getKakaoUrl(HttpSession httpSession) {
        return kakaoAuthService.setKakaoAuthUrl(httpSession);
    }

    @GetMapping("/callback")
    public KakaoAuthResponseDTO kakaoCallBack(
            @RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state,
            HttpSession httpSession) {
        return kakaoAuthService.kakaoLogin(code, state, httpSession);
    }

    @PostMapping("/reissue")
    public JwtTokenDto reissue(@RequestBody TokenReissueRequestDTO request) {
        return kakaoAuthService.reissueToken(request.getRefreshToken());
    }

    @PostMapping("/logout")
    public void logout(@RequestBody LogoutRequestDTO request) {
        kakaoAuthService.logout(request.getRefreshToken());
    }
}

