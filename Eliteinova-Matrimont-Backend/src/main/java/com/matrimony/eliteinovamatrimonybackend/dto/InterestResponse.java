package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InterestResponse {
    private Long id;
    private Long fromUserId;
    private String fromUserName;
    private Long toProfileId;
    private String toProfileName;
    private String status;
    private LocalDateTime expressedAt;
    private LocalDateTime respondedAt;
    private String message;
    private ProfileResponse profile; // For received interests
}