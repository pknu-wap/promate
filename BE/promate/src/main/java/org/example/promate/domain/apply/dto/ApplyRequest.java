package org.example.promate.domain.apply.dto;

import lombok.Getter;
import java.util.List;

@Getter
public class ApplyRequest {

    private String preferredRole;
    private String introduction;
    private List<SelectedProjectDTO> selectedProjectIds;

    @Getter
    public static class SelectedProjectDTO {
        private Long projectId; // 시스템 혹은 수동 프로젝트의 ID
        private boolean isManual; // 수동 여부 플래그
    }
}

