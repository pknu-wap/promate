package org.example.promate.domain.auth.service;

import jakarta.servlet.http.HttpSession;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.auth.dto.KakaoAuthResponseDTO;
import org.example.promate.domain.auth.dto.KakaoTokenResponseDTO;
import org.example.promate.domain.auth.dto.KakaoUserResponseDTO;
import org.example.promate.domain.user.dto.UserResponseDTO;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Getter
@RequiredArgsConstructor

@Service
public class KakaoAuthService {

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;

    @Value("${KAKAO_REST_API_KEY}")
    private String kakaoClientId;

    @Value("${KAKAO_REDIRECT_URI}")
    private String kakaoRedirectUri;

    @Value("${KAKAO_CLIENT_SECRET}")
    private String kakaoClientSecret;

    public String setKakaoAuthUrl(HttpSession httpSession) {
        httpSession.setAttribute("state", UUID.randomUUID().toString());
        return "https://kauth.kakao.com/oauth/authorize?client_id="
                + kakaoClientId
                + "&redirect_uri="
                + kakaoRedirectUri
                + "&response_type=code"
                + "&state="
                + httpSession.getAttribute("state");
    }

    public KakaoAuthResponseDTO kakaoLogin(String code, String state, HttpSession httpSession) {

        String sessionState = (String) httpSession.getAttribute("state");

        if (sessionState == null) {
            throw new IllegalArgumentException("sessionState가 null 값입니다.");
        }
        if (state == null) {
            throw new IllegalArgumentException("state가 null 값입니다.");
        }
        if (!sessionState.equals(state)) {
            throw new IllegalArgumentException("sessionState와 state 값이 일치하지 않습니다.");
        }

        // access token 요청
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();
        tokenBody.add("grant_type", "authorization_code");
        tokenBody.add("client_id", kakaoClientId);
        tokenBody.add("redirect_uri", kakaoRedirectUri);
        tokenBody.add("code", code);
        tokenBody.add("client_secret", kakaoClientSecret);

        HttpEntity<MultiValueMap<String, String>> tokenRequest =
                new HttpEntity<>(tokenBody, tokenHeaders);

        ResponseEntity<KakaoTokenResponseDTO> tokenResponse = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                tokenRequest,
                KakaoTokenResponseDTO.class
        );

        KakaoTokenResponseDTO tokenResult = tokenResponse.getBody();


        if (tokenResult == null || tokenResult.getAccessToken() == null) {
            throw new IllegalArgumentException("access token 요청에 실패했습니다.");
        }

        String accessToken = tokenResult.getAccessToken();

        // 사용자 정보 조회
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(accessToken);
        userHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<?> userRequest = new HttpEntity<>(userHeaders);

        ResponseEntity<KakaoUserResponseDTO> userResponse =
                restTemplate.exchange(
                        userInfoUrl,
                        HttpMethod.GET,
                        userRequest,
                        KakaoUserResponseDTO.class
                );

        KakaoUserResponseDTO userInfo = userResponse.getBody();

        if (userInfo == null) {
            throw new IllegalArgumentException("사용자 정보 조회에 실패했습니다.");
        }

        Long kakaoId = userInfo.getKakaoId();

        User user = userRepository.findByKakaoId(kakaoId)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .kakaoId(kakaoId)
                                .email(null)
                                .build()
                ));

        return KakaoAuthResponseDTO.builder()
                .id(user.getId())
                .build();

    }
}