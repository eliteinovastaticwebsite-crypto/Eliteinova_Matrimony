package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProfileResponse {
    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private Integer height;
    private String education;
    private String profession;
    private String location;
    private String religion;
    private String caste;
    private String mobile;
    private String subCaste;
    private String maritalStatus;
    private String familyStatus;
    private String familyType;
    private Integer annualIncome;
    private String about;
    private List<String> photos;
    private Boolean isVerified;
    private Boolean isPremium;
    private String dosham;
    private String employedIn;
    private String district;
    private String state;
    private String country;
    private LocalDateTime createdAt;
    private Integer minAge;
    private Integer maxAge;
    private String specialization;

    // User info
    private Long userId;
    private String userEmail;
}