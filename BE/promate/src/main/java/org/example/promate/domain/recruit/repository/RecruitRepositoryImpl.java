package org.example.promate.domain.recruit.repository;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.recruit.dto.request.RecruitSearchCondition;
import org.example.promate.domain.recruit.entity.Recruit;
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
    public Page<Recruit> searchRecruits(RecruitSearchCondition condition, Pageable pageable) {

        List<Recruit> content = queryFactory
                .select(recruit)
                .from(recruit)
                .where(
                        recruit.isDeleted.isFalse(), // 삭제되지 않은 게시글만
                        containsSearch(condition.search()),
                        eqCategory(condition.category())
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(recruit.createdAt.desc()) // 최신순 정렬
                .fetch();

        // 전체 카운트 쿼리
        JPAQuery<Long> countQuery = queryFactory
                .select(recruit.count())
                .from(recruit)
                .where(
                        recruit.isDeleted.isFalse(), // 카운트 쿼리에도 삭제 플래그 조건
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