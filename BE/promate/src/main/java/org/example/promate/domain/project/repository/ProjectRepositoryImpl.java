package org.example.promate.domain.project.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.enums.ProjectStatus;

import java.util.List;

import static org.example.promate.domain.project.entity.QMember.member;
import static org.example.promate.domain.project.entity.QProject.project;
import static org.example.promate.domain.recruit.entity.QRecruit.recruit;

@RequiredArgsConstructor
public class ProjectRepositoryImpl implements ProjectRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Project> findCompletedProjectsByUserId(Long userId) {
        return queryFactory
                .select(project)
                .from(project)
                .distinct()
                .join(project.recruit, recruit).fetchJoin()
                .join(project.members, member)
                .where(
                        member.user.id.eq(userId),
                        project.status.eq(ProjectStatus.COMPLETED),
                        member.isDeleted.isFalse()
                )
                .fetch();
    }
}
