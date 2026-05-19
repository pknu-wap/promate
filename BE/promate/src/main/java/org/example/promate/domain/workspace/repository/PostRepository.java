package org.example.promate.domain.workspace.repository;

import org.example.promate.domain.workspace.entity.Post;
import org.example.promate.domain.workspace.enums.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("select p from Post p " +
            "join fetch p.project " +
            "where p.id = :id and p.project.id = :projectId")
    Optional<Post> findByIdAndProjectId(@Param("id") Long id, @Param("projectId") Long projectId);

    boolean existsByIdAndMemberId(Long id, Long writerId);

    @Query("select p from Post p " +
            "join fetch p.member m " +
            "join fetch m.user u " +
            "where p.id = :postId and p.isDeleted = false")
    Optional<Post> findPostWithMemberAndUser(@Param("postId") Long postId);

    @Query("select p from Post p " +
            "join fetch p.project " +
            "where p.project.id = :projectId " +
            "and p.isDeleted = false " +
            "and (:postType is null or p.postType = :postType) " +
            "order by p.createdAt desc") // 최신순 정렬 추가
    List<Post> findAllByProjectIdAndPostType(
            @Param("projectId") Long projectId,
            @Param("postType") PostType type
    );
}
