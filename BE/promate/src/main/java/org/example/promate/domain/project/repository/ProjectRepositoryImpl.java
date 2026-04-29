package org.example.promate.domain.project.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.apply.dto.PastProjectDto;
import org.example.promate.domain.project.enums.ProjectStatus;

import java.util.List;

import static org.example.promate.domain.project.entity.QMember.member;
import static org.example.promate.domain.project.entity.QProject.project;
import static org.example.promate.domain.recruit.entity.QRecruit.recruit;

@RequiredArgsConstructor

public class ProjectRepositoryImpl implements ProjectRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<PastProjectDto> findCompletedProjectsByUserId(Long userId) {
        return queryFactory
                .select(Projections.constructor(PastProjectDto.class,
                        project.id,
                        project.title,
                        project.recruit.category
                ))
                .from(project)
                .join(project.recruit, recruit)
                .join(project.members, member)
                .where(
                        member.user.id.eq(userId),
                        project.status.eq(ProjectStatus.COMPLETED)
                )
                .fetch();
    }
}
