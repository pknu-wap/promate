package org.example.promate.domain.recruit.repository;

import org.example.promate.domain.recruit.dto.request.RecruitSearchCondition;
import org.example.promate.domain.recruit.entity.Recruit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecruitRepositoryCustom {
    Page<Recruit> searchRecruits(RecruitSearchCondition condition, Pageable pageable);
}
