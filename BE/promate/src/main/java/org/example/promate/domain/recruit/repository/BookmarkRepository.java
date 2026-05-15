package org.example.promate.domain.recruit.repository;

import org.example.promate.domain.recruit.entity.Bookmark;
import org.example.promate.domain.recruit.entity.Recruit;
import org.example.promate.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark,Long> {
    Optional<Bookmark> findByUserAndRecruit(User user, Recruit recruit);
}
