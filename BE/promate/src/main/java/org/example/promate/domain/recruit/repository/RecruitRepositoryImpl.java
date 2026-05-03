package org.example.promate.domain.recruit.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.recruit.dto.request.RecruitSearchCondition;
import org.example.promate.domain.recruit.dto.response.RecruitResponse;
import org.example.promate.domain.recruit.enums.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

import static org.example.promate.domain.recruit.entity.QRecruit.recruit;

@Repository
@RequiredArgsConstructor
public class RecruitRepositoryImpl implements RecruitRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<RecruitResponse> searchRecruits(RecruitSearchCondition condition, Pageable pageable) {

        // 데이터 조회 쿼리
        List<RecruitResponse> content = queryFactory
                .select(Projections.constructor(RecruitResponse.class,
                        recruit.id,
                        recruit.title,
                        recruit.category,
                        recruit.createdAt,
                        recruit.deadline,
                        recruit.status,
                        recruit.totalSlots,
                        recruit.joinedCount
                ))
                .from(recruit)
                .where(
                        recruit.isDeleted.isFalse(),
                        containsSearch(condition.search()),
                        eqCategory(condition.category())
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(recruit.createdAt.desc()) //기본값: 최신순
                .fetch();

        // 전체 카운트 쿼리
        JPAQuery<Long> countQuery = queryFactory
                .select(recruit.count())
                .from(recruit)
                .where(
                        containsSearch(condition.search()),
                        eqCategory(condition.category())
                );

        // Page 객체로 반환
        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    // 제목 검색 (search 키워드가 포함되어 있는지)
    private BooleanExpression containsSearch(String search) {
        return StringUtils.hasText(search) ? recruit.title.containsIgnoreCase(search) : null;
    }

    //카테고리 필터링 (정확히 일치하는지)
    private BooleanExpression eqCategory(Category category) {
        if (category == null) {
            return null;
        }
        // Enum 대 Enum 비교
        return recruit.category.eq(category);
    }
}
