package org.example.promate.domain.workspace.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

public class ScheduleReqDto {

    @Getter
    @AllArgsConstructor
    public static class AddScheduleDto {
        @NotBlank(message = "제목을 입력해 주세요.")
        private String title;

        private String content;

        @NotNull(message = "시작 날짜는 필수입니다.")
        private LocalDate startDate;

        @NotNull(message = "종료 날짜는 필수입니다.")
        private LocalDate endDate;
    }

    @Getter
    @AllArgsConstructor
    public static class ModifyScheduleDto {
        @NotBlank(message = "제목을 입력해 주세요.")
        private String title;

        private String content;

        @NotNull(message = "시작 날짜는 필수입니다.")
        private LocalDate startDate;

        @NotNull(message = "종료 날짜는 필수입니다.")
        private LocalDate endDate;
    }
}
