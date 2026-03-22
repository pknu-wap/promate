/*
    생성 시각, 수정 시각 외에 삭제 여부 및 삭제 일시까지 관리하고자 하는 경우
 */
package org.example.promate.global.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public class BaseEntity extends BaseTimeEntity{

    @Column(name="is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name="deleted_at")
    private LocalDateTime deletedAt;
}
