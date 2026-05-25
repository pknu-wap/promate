package org.example.promate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
//UserDetailsServiceAutoConfiguration은 Spring Boot가 자동으로 ID/PW 기반 로그인 시스템을 세팅하는 클래스입니다.
//제외하지 않을 경우, → 기본 인증 시스템 자동 생성 → SecurityConfig와 충돌
public class PromateApplication {

    public static void main(String[] args) {
        SpringApplication.run(PromateApplication.class, args);
    }

}
