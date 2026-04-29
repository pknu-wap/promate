package org.example.promate.domain.apply.service;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.apply.dto.ApplyFormResponse;
import org.example.promate.domain.apply.dto.ApplyRequest;
import org.example.promate.domain.apply.dto.ApplyResponse;
import org.example.promate.domain.apply.dto.PastProjectDto;
import org.example.promate.domain.apply.entity.Apply;
import org.example.promate.domain.apply.entity.ApplyProject;
import org.example.promate.domain.apply.enums.Status;
import org.example.promate.domain.apply.repository.ApplicationProjectRepository;
import org.example.promate.domain.apply.repository.ApplyRepository;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.repository.ProjectRepository;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.recruit.repository.RecruitRepository;
import org.example.promate.domain.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ApplyService {

    private final ApplyRepository applyRepository;
    private final ApplicationProjectRepository applyProjectRepository;
    //private final UserRepository userRepository;
    private final RecruitRepository recruitRepository;
    private final ProjectRepository projectRepository; // 사용자의 과거 프로젝트 조회를 위함

    public ApplyFormResponse getApplyForm(Long recruitmentId, Long userId) {
        // 모집글 제목을 위한 조회 (Soft Delete 고려)
        Recruit recruit = recruitRepository.findByIdAndIsDeletedFalse(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 사용자의 과거 완료된 프로젝트 목록 조회
        // ProMate에서 완료된 프로젝트(Category, Title) 정보를 DTO 형식으로 바로 리스트화
        List<PastProjectDto> pastProjects = projectRepository.findCompletedProjectsByUserId(userId);

        return ApplyFormResponse.of(recruit.getTitle(), pastProjects);
    }


    public ApplyResponse submit(Long recruitmentId, Long userId, ApplyRequest request) {
        // 1.중복 지원 방지 검증
        if (applyRepository.existsByRecruitIdAndUserIdAndIsDeletedFalse(recruitmentId, userId)) {
            throw new IllegalArgumentException("이미 지원한 모집글입니다.");
        }

        // 2. 연관 엔티티 조회
        Recruit recruit = recruitRepository.findById(recruitmentId)
                .orElseThrow(() ->new IllegalArgumentException("존재하지 않는 게시글 입니다."));
        //User user = userRepository.findById(userId).get();

        // 3. 지원서 생성 및 저장
        Apply application = Apply.builder()
                //.user(user)
                .recruit(recruit)
                .objective(request.preferredRole())
                .prContent(request.introduction())
                .status(Status.PENDING)
                .build();
        applyRepository.save(application);

        // 4. 선택한 프로젝트 이력 매핑 저장
        if (request.selectedProjectIds() != null && !request.selectedProjectIds().isEmpty()) {
            List<Project> projects = projectRepository.findAllById(request.selectedProjectIds());

            List<ApplyProject> mappings = projects.stream()
                    .map(p -> new ApplyProject(application, p))
                    .toList();
            applyProjectRepository.saveAll(mappings);
        }

        return ApplyResponse.from(application);
    }
}
