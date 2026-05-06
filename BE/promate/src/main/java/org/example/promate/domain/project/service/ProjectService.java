package org.example.promate.domain.project.service;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.apply.repository.ApplyRepository;
import org.example.promate.domain.project.dto.MyActivityResponseDTO;
import org.example.promate.domain.project.dto.MyApplicationResponseDTO;
import org.example.promate.domain.project.dto.MyProjectResponseDTO;
import org.example.promate.domain.project.enums.ProjectStatus;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.project.repository.ProjectRepository;
import org.example.promate.domain.recruit.repository.RecruitRepository;
import org.example.promate.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final RecruitRepository recruitRepository;
    private final ApplyRepository applyRepository;
    private final MemberRepository memberRepository;


    @Transactional(readOnly = true)
    public List<MyApplicationResponseDTO> getMyApplications(Long userId) {
        return applyRepository.findByUserIdWithRecruit(userId)
                .stream()
                .map(apply -> MyApplicationResponseDTO.builder()
                        .applicationId(apply.getId())
                        .recruitmentId(apply.getRecruit().getId())
                        .title(apply.getRecruit().getTitle())
                        .status(apply.getStatus())
                        .createdAt(apply.getCreatedAt())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MyProjectResponseDTO> getMyProjects(Long userId) {
        return memberRepository.findByUserIdAndProjectStatus(
                        userId,
                        ProjectStatus.ACTIVE
                )
                .stream()
                .map(member -> MyProjectResponseDTO.builder()
                        .projectId(member.getProject().getId())
                        .title(member.getProject().getTitle())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MyActivityResponseDTO> getMyActivities(Long userId) {

        return memberRepository
                .findByUserIdAndProjectStatus(userId, ProjectStatus.COMPLETED)
                .stream()
                .map(member -> MyActivityResponseDTO.builder()
                        .projectId(member.getProject().getId())
                        .title(member.getProject().getTitle())
                        .build())
                .toList();
    }
}
