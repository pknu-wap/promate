package org.example.promate.domain.recruit.dto.response;

public record BookmarkResponse(
        Long recruitmentId,  // 관심 설정할 게시글의 고유 ID
        boolean isBookmarked // true: 관심 등록됨, false: 관심 해제됨
) {}
