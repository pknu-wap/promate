package org.example.promate.domain.recruit.dto.response;

import org.springframework.data.domain.Page;

import java.util.List;

public record RecruitPageResponse<T>(
        List<T> content,
        PageInfo pageInfo
) {
    public static <T> RecruitPageResponse<T> of(Page<T> page) {
        return new RecruitPageResponse<>(
                page.getContent(),
                new PageInfo(
                        page.getNumber(),
                        page.getSize(),
                        page.getTotalElements(),
                        page.getTotalPages(),
                        page.isLast()
                )
        );
    }
    public record PageInfo(
            int currentPage,
            int pageSize,
            long totalElements,
            int totalPages,
            boolean last
    ) {}
}