package org.example.promate.domain.recruit.repository;

import org.example.promate.domain.recruit.entity.Bookmark;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark,Long> {
    Optional<Bookmark> findByUserAndRecruit(User user, Recruit recruit);

    @Query(value = "select b from Bookmark b join fetch b.recruit where b.user.id = :userId",
            countQuery = "select count(b) from Bookmark b where b.user.id = :userId")
    Page<Bookmark> findByUserIdWithRecruit(@Param("userId") Long userId, Pageable pageable);
}
