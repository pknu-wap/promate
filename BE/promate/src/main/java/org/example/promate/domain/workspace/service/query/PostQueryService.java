package org.example.promate.domain.workspace.service.query;

import org.example.promate.domain.workspace.dto.res.PostResDto;

public interface PostQueryService {
    PostResDto.PostDto getPost(Long userId, Long projectId, Long postId);
    PostResDto.PostListDto getAllPost(Long userId, Long projectId);
}
