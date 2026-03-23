package org.example.promate.domain.workspace.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.promate.global.entity.BaseEntity;

@Getter
@MappedSuperclass
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access =  AccessLevel.PROTECTED)
@SuperBuilder
public class BaseBoard extends BaseEntity {
    @Column(name="title", nullable = false)
    private String title;

    @Column(name="content", nullable = false)
    private String content;
}
