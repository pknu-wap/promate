package org.example.promate.domain.recruit.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.promate.global.ApiPayload.code.BaseSuccessCode;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum RecruitSuccessCode implements BaseSuccessCode {

    RECRUITMENT_CREATED(HttpStatus.CREATED, "RECRUIT_S001", "팀 모집 게시글 발행을 성공했습니다."),
    RECRUITMENT_FOUND(HttpStatus.OK, "RECRUIT_S002", "팀 모집글 상세 조회를 성공했습니다."),
    RECRUITMENT_UPDATED(HttpStatus.OK, "RECRUIT_S003", "팀 모집글 수정을 성공했습니다."),

    RECRUITMENT_DELETED(HttpStatus.OK, "RECRUIT_S004", "팀 모집글 삭제를 성공했습니다."),
    RECRUITMENT_FILTERED(HttpStatus.OK, "RECRUIT_S005", "팀 모집글 필터링을 성공했습니다."),
    RECRUITMENT_BOOKMARKED(HttpStatus.OK, "RECRUIT_S006", "팀 모집글 북마크를 성공했습니다."),
    RECRUITMENT_BOOKMARKED_LIST_FETCHED(HttpStatus.OK,"RECRUIT_S007", "북마크된 모집글 리스트 불러오기를 성공했습니다."),

    APPLY_FORM_LOADED(HttpStatus.OK, "RECRUIT_S008", "팀 지원글 작성 페이지 불러오기를 성공했습니다."),
    APPLY_FORM_SUBMITTED(HttpStatus.OK, "RECRUIT_S009", "팀 지원글 발행을 성공했습니다."),
    APPLY_FORM_UPDATED(HttpStatus.OK, "RECRUIT_S010", "팀 지원글 수정을 성공했습니다."),
    APPLY_FORM_DELETED(HttpStatus.OK, "RECRUIT_S011", "팀 지원글 삭제를 성공했습니다."),

    APPLY_PENDING_LIST_FETCHED(HttpStatus.OK,"RECRUIT_S012", "대기 중인 팀 지원서 리스트 불러오기를 성공했습니다."),
    APPLY_REJECTED_LIST_FETCHED(HttpStatus.OK,"RECRUIT_S013", "거절된 팀 지원서 리스트 불러오기를 성공했습니다."),
    APPLY_ACCEPTED_LIST_FETCHED(HttpStatus.OK,"RECRUIT_S014", "수락된 팀 지원서 리스트 불러오기를 성공했습니다."),
    APPLY_DETAIL_FETCHED(HttpStatus.OK, "RECRUIT_S015", "팀 지원서 상세 조회를 성공했습니다."),
    APPLY_STATUS_UPDATED(HttpStatus.OK, "RECRUIT_S016", "지원서 상태 수정을 완료되었습니다."),

    RECRUITMENT_COMPLETED(HttpStatus.OK,"RECRUIT_S017", "모집이 완료되었으며, 프로젝트 팀이 생성되었습니다."),
    RECRUITMENT_CREATED_LIST_FETCHED(HttpStatus.OK,"RECRUIT_S018", "내가 생성한 모집글 리스트 불러오기를 성공했습니다."),
    RECRUIT_LEADER_PROFILE_FOUND(HttpStatus.OK, "RECRUIT_S019", "팀장 프로필 조회에 성공했습니다.")
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
