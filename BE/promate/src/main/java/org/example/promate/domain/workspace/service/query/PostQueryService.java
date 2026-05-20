package org.example.promate.domain.workspace.service.query;

import org.example.promate.domain.workspace.dto.res.PostResDto;
import org.example.promate.domain.workspace.enums.PostType;

public interface PostQueryService {
    PostResDto.PostDto getPost(Long userId, Long projectId, Long postId);
    PostResDto.PostListDto getAllPostByType(Long userId, Long projectId, PostType type);
}
