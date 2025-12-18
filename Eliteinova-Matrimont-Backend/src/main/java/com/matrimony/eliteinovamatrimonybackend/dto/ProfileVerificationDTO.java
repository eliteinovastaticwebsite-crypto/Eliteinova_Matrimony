// ProfileVerificationDTO.java
package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProfileVerificationDTO {
    private Long id; // Profile ID
    private Long userId;
    private String userName;
    private String profileName;
    private Integer age;
    private String gender;
    private String city;
    private String state;
    private String religion;
    private String caste;
    private String subCaste;
    private String dosham;
    private String education;
    private String profession;
    private LocalDateTime submittedAt;
    private String about;

    // Photos
    private List<String> photoUrls;
    private Integer photoCount;

    // Documents (Jathagam, etc.)
    private List<UserDocumentDTO> documents;

    @Data
    public static class UserDocumentDTO {
        private Long id;
        private String documentType;
        private String fileName;
        private String fileUrl;
        private LocalDateTime uploadedAt;
    }
}