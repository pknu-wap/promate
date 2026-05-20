package org.example.promate.domain.user.repository;

import org.example.promate.domain.user.entity.UserProjectHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserProjectHistoryRepository extends JpaRepository<UserProjectHistory, Long> {

    List<UserProjectHistory> findByUserId(Long userId);

    Optional<UserProjectHistory> findByIdAndUserId(Long id, Long userId);
}