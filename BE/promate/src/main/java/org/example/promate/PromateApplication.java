package org.example.promate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PromateApplication {

    public static void main(String[] args) {
        SpringApplication.run(PromateApplication.class, args);
    }

}
