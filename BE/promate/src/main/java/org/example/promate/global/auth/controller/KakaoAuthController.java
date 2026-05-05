package org.example.promate.global.auth.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.promate.global.auth.dto.KakaoAuthResponseDTO;
import org.example.promate.global.auth.dto.LogoutRequestDTO;
import org.example.promate.global.auth.dto.TokenReissueRequestDTO;
import org.example.promate.global.auth.service.KakaoAuthService;
import org.example.promate.global.jwt.JwtTokenDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth/kakao")
public class KakaoAuthController {
    private final KakaoAuthService kakaoAuthService;

    @GetMapping("/login")
    public ResponseEntity<Map<String, Object>> getKakaoUrl(HttpSession httpSession) {
        String url = kakaoAuthService.setKakaoAuthUrl(httpSession);
        return ResponseEntity.ok(Map.of(
                "isSuccess", true,
                "code", "AUTH_S001",
                "message", "카카오 로그인 URL 생성 성공",
                "data", Map.of("url", url)
        ));
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

