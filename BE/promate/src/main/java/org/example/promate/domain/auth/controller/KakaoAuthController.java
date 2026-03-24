package org.example.promate.domain.auth.controller;

import jakarta.servlet.http.HttpSession;
import org.example.promate.domain.auth.service.KakaoAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class KakaoAuthController {
    @Autowired
    private KakaoAuthService kakaoAuthService;

    @GetMapping("/get")
    public String getKakaoUrl(HttpSession httpSession) {
        return kakaoAuthService.SetKakaoAuthUrl(httpSession);
    }
}