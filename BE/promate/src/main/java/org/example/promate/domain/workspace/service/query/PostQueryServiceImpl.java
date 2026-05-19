package org.example.promate.domain.workspace.service.query;

import lombok.RequiredArgsConstructor;
import org.example.promate.domain.project.code.MemberErrorCode;
import org.example.promate.domain.project.exception.MemberException;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.workspace.code.PostErrorCode;
import org.example.promate.domain.workspace.converter.PostConverter;
import org.example.promate.domain.workspace.dto.res.PostResDto;
import org.example.promate.domain.workspace.entity.Post;
import org.example.promate.domain.workspace.exception.PostException;
import org.example.promate.domain.workspace.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostQueryServiceImpl implements PostQueryService{
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;


    @Override
    public PostResDto.PostDto getPost(Long userId, Long projectId, Long postId) {
        //검증1: 사용자가 프로젝트 멤버인가
        if(!memberRepository.existsByUserIdAndProjectId(userId, projectId)){
            throw new MemberException(MemberErrorCode.POST_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        Post post = postRepository.findPostWithMemberAndUser(postId)
                .orElseThrow(() -> new PostException(PostErrorCode.NOT_FOUND_BY_POST_ID));

        return PostConverter.toPostDto(post);
    }

    @Override
    public PostResDto.PostListDto getAllPost(Long userId, Long projectId) {
        //검증1: 사용자가 프로젝트 멤버인가
        if(!memberRepository.existsByUserIdAndProjectId(userId, projectId)){
            throw new MemberException(MemberErrorCode.POST_FORBIDDEN_NOT_PROJECT_MEMBER);
        }

        List<Post> allByProjectId = postRepository.findAllByProjectId(projectId);

        return PostConverter.toPostListDto(allByProjectId);
    }
}
