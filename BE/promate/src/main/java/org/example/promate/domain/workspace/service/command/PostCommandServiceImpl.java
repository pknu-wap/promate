package org.example.promate.domain.workspace.service.command;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.promate.domain.project.code.MemberErrorCode;
import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.project.entity.Project;
import org.example.promate.domain.project.exception.MemberException;
import org.example.promate.domain.project.repository.MemberRepository;
import org.example.promate.domain.workspace.code.PostErrorCode;
import org.example.promate.domain.workspace.converter.PostConverter;
import org.example.promate.domain.workspace.dto.req.PostReqDto;
import org.example.promate.domain.workspace.dto.res.PostResDto;
import org.example.promate.domain.workspace.entity.Post;
import org.example.promate.domain.workspace.exception.PostException;
import org.example.promate.domain.workspace.repository.PostRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class PostCommandServiceImpl implements PostCommandService{
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;

    // 게시글 작성하기
    @Override
    public PostResDto.CreatedPostDto createPost(Long userId, Long projectId, PostReqDto.CreatePostDto dto) {
        // 검증1: 로그인 사용자가 프로젝트 멤버인가
        // project 사용하니까 fetch join
        Member member = memberRepository.findMemberWithProject(projectId, userId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.POST_FORBIDDEN_NOT_PROJECT_MEMBER));

        Project project = member.getProject();

        Post post = PostConverter.toEntity(dto, member, project);

        postRepository.save(post);

        return PostConverter.toCreatedPostDto(post);
    }

    // 게시글 수정하기
    @Override
    public PostResDto.UpdatedPostDto updatePost(Long userId, Long projectId, Long postId, PostReqDto.UpdatePostDto dto) {
        // 검증1: 로그인 사용자가 프로젝트 멤버인가
        Member member = memberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.POST_FORBIDDEN_NOT_PROJECT_MEMBER));

        // 검증2: postId가 존재하는가
        if(!postRepository.existsById(postId)){
            throw new PostException(PostErrorCode.NOT_FOUND_BY_POST_ID);
        }

        // 검증3: post가 project에 들어가 있는가
        Post post = postRepository.findByIdAndProjectId(postId, projectId)
                .orElseThrow(() -> new PostException(PostErrorCode.POST_NOT_FOUND_IN_PROJECT));

        // 검증4: 로그인 사용자가 게시글 작성자인가
        if(!postRepository.existsByIdAndMemberId(postId, member.getId())){
            throw new PostException(PostErrorCode.ONLY_WRITER_ACCESS_UPDATE);
        }

        post.update(dto);
        postRepository.saveAndFlush(post);

        return PostConverter.toUpdatedPostDto(post);
    }

    // 게시글 삭제하기
    @Override
    public PostResDto.DeletedPostDto deletePost(Long userId, Long projectId, Long postId) {
        // 검증1: 로그인 사용자가 프로젝트 멤버인가, project 사용 안 함
        Member member = memberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.POST_FORBIDDEN_NOT_PROJECT_MEMBER));

        // 검증2: postId가 존재하는가
        if(!postRepository.existsById(postId)){
            throw new PostException(PostErrorCode.NOT_FOUND_BY_POST_ID);
        }

        // 검증3: post가 project 게시글이 맞는가
        Post post = postRepository.findByIdAndProjectId(postId, projectId)
                .orElseThrow(() -> new PostException(PostErrorCode.POST_NOT_FOUND_IN_PROJECT));

        // 검증4: 로그인 사용자가 게시글 작성자인가
        if(!postRepository.existsByIdAndMemberId(postId, member.getId())){
            throw new PostException(PostErrorCode.ONLY_WRITER_ACCESS_DELETE);
        }

        post.delete();

        return PostConverter.toDeletedPostDto(post);
    }
}
