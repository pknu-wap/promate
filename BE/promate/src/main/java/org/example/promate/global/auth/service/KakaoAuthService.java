package org.example.promate.global.auth.service;

import jakarta.servlet.http.HttpSession;
import org.springframework.transaction.annotation.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.example.promate.global.ApiPayload.exception.GeneralException;
import org.example.promate.global.auth.dto.KakaoAuthResponseDTO;
import org.example.promate.global.auth.dto.KakaoTokenResponseDTO;
import org.example.promate.global.auth.dto.KakaoUserResponseDTO;
import org.example.promate.global.auth.entity.RefreshToken;
import org.example.promate.global.auth.exception.AuthErrorCode;
import org.example.promate.global.auth.exception.AuthException;
import org.example.promate.global.auth.repository.RefreshTokenRepository;
import org.example.promate.domain.user.entity.User;
import org.example.promate.domain.user.repository.UserRepository;
import org.example.promate.global.jwt.JwtProvider;
import org.example.promate.global.jwt.JwtTokenDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Getter
@RequiredArgsConstructor

@Service
public class KakaoAuthService {

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;


    @Value("${KAKAO_REST_API_KEY}")
    private String kakaoClientId;

    @Value("${KAKAO_REDIRECT_URI}")
    private String kakaoRedirectUri;

    @Value("${KAKAO_CLIENT_SECRET}")
    private String kakaoClientSecret;

    public String setKakaoAuthUrl(HttpSession httpSession) {
        String state = UUID.randomUUID().toString();
        httpSession.setAttribute("state", state);

        System.out.println("LOGIN STATE = " + state);
        System.out.println("LOGIN SESSION ID = " + httpSession.getId()); // 디버깅로그

        String encodedRedirectUri = URLEncoder.encode(kakaoRedirectUri, StandardCharsets.UTF_8);

        return "https://kauth.kakao.com/oauth/authorize?client_id="
                + kakaoClientId
                + "&redirect_uri="
                + encodedRedirectUri
                + "&response_type=code"
                + "&state="
                + state;
    }
    @Transactional
    public KakaoAuthResponseDTO kakaoLogin(String code, String state, HttpSession httpSession) {

        String sessionState = (String) httpSession.getAttribute("state");

        System.out.println("REQUEST state = " + state);
        System.out.println("SESSION state = " + sessionState);
        System.out.println("SESSION ID = " + httpSession.getId()); // 디버깅로그

        if (sessionState == null || state == null) {
            throw new AuthException(AuthErrorCode.STATE_NOT_FOUND);
        }
        if (!sessionState.equals(state)) {
            throw new AuthException(AuthErrorCode.STATE_MISMATCH);
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

        KakaoTokenResponseDTO tokenResult;

        try {
            ResponseEntity<KakaoTokenResponseDTO> tokenResponse = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    tokenRequest,
                    KakaoTokenResponseDTO.class
            );
            tokenResult = tokenResponse.getBody();
        } catch (Exception e) {

            e.printStackTrace(); // 디버깅로그

            throw new AuthException(AuthErrorCode.KAKAO_TOKEN_REQUEST_FAILED);
        }

        if (tokenResult == null || tokenResult.getAccessToken() == null) {
            throw new AuthException(AuthErrorCode.KAKAO_TOKEN_REQUEST_FAILED);
        }

        String accessToken = tokenResult.getAccessToken();

        // 사용자 정보 조회
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(accessToken);
        userHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<?> userRequest = new HttpEntity<>(userHeaders);

        KakaoUserResponseDTO userInfo;
        try {
            ResponseEntity<KakaoUserResponseDTO> userResponse =
                    restTemplate.exchange(
                    userInfoUrl,
                    HttpMethod.GET,
                    userRequest,
                    KakaoUserResponseDTO.class
            );
            userInfo = userResponse.getBody();
        } catch (Exception e) {

            e.printStackTrace(); // 디버깅로그
            throw new AuthException(AuthErrorCode.KAKAO_USER_INFO_FAILED);
        }

        if (userInfo == null) {
            throw new AuthException(AuthErrorCode.KAKAO_USER_INFO_FAILED);
        }

        Long kakaoId = userInfo.getKakaoId();

        User user = userRepository.findByKakaoId(kakaoId)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .kakaoId(kakaoId)
                                .isProfileCompleted(false)
                                .build()
                ));

        JwtTokenDto jwtTokenDto = jwtProvider.generateToken(user);

        refreshTokenRepository.findByUser(user)
                .ifPresentOrElse(
                        refreshToken -> refreshToken.updateToken(
                                jwtTokenDto.refreshToken(),
                                jwtProvider.getRefreshTokenExpiredAt()
                        ),
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .user(user)
                                        .refreshToken(jwtTokenDto.refreshToken())
                                        .expiredAt(jwtProvider.getRefreshTokenExpiredAt())
                                        .build()
                        )
                );


        return KakaoAuthResponseDTO.builder()
                .id(user.getId())
                .accessToken(jwtTokenDto.accessToken())
                .refreshToken(jwtTokenDto.refreshToken())
                .build();



    }

    @Transactional
    public JwtTokenDto reissueToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthException(AuthErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        if (!jwtProvider.validateToken(refreshToken)) {
            throw new AuthException(AuthErrorCode.INVALID_REFRESH_TOKEN);
        }

        if (!jwtProvider.isRefreshToken(refreshToken)) {
            throw new AuthException(AuthErrorCode.INVALID_REFRESH_TOKEN_TYPE);
        }

        Long userId = jwtProvider.getUserId(refreshToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND));

        RefreshToken savedRefreshToken = refreshTokenRepository.findByUser(user)
                .orElseThrow(() -> new AuthException(AuthErrorCode.STORED_REFRESH_TOKEN_NOT_FOUND));

        if (!savedRefreshToken.getRefreshToken().equals(refreshToken)) {
            throw new AuthException(AuthErrorCode.REFRESH_TOKEN_MISMATCH);
        }

        String newAccessToken = jwtProvider.generateAccessToken(user);
        String newRefreshToken = jwtProvider.generateRefreshToken(user);

        savedRefreshToken.updateToken(
                newRefreshToken,
                jwtProvider.getRefreshTokenExpiredAt()
        );

        return new JwtTokenDto(newAccessToken, newRefreshToken);
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthException(AuthErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        if (!jwtProvider.validateToken(refreshToken)) {
            throw new AuthException(AuthErrorCode.INVALID_REFRESH_TOKEN);
        }

        if (!jwtProvider.isRefreshToken(refreshToken)) {
            throw new AuthException(AuthErrorCode.INVALID_REFRESH_TOKEN_TYPE);
        }

        Long userId = jwtProvider.getUserId(refreshToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND));

        RefreshToken savedRefreshToken = refreshTokenRepository.findByUser(user)
                .orElseThrow(() -> new AuthException(AuthErrorCode.STORED_REFRESH_TOKEN_NOT_FOUND));

        if (!savedRefreshToken.getRefreshToken().equals(refreshToken)) {
            throw new AuthException(AuthErrorCode.REFRESH_TOKEN_MISMATCH);
        }

        refreshTokenRepository.delete(savedRefreshToken);
    }

    @Transactional(readOnly = true)
    public boolean getProfileCompletedByRefreshToken(String refreshToken) {
        RefreshToken savedToken = refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new GeneralException(AuthErrorCode.INVALID_REFRESH_TOKEN));

        return savedToken.getUser().isProfileCompleted();
    }
}