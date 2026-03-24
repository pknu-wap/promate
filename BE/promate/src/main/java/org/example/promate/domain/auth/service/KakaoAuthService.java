package org.example.promate.domain.auth.service;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class KakaoAuthService {

    @Value("${KAKAO_REST_API_KEY}")
    private String kakaoClientId;

    @Value("${KAKAO_REDIRECT_URI}")
    private String kakaoRedirectUri;

    public String SetKakaoAuthUrl(HttpSession httpSession) {
        httpSession.setAttribute("state", UUID.randomUUID().toString());
        return "https://kauth.kakao.com/oauth/authorize?client_id="
                + kakaoClientId
                + "&redirect_uri="
                + kakaoRedirectUri
                + "&response_type=code"
                + "&state="
                + httpSession.getAttribute("state");
    }

}