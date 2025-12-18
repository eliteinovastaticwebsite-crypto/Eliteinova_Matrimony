package com.matrimony.eliteinovamatrimonybackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private Integer age;
    private String gender;
    private Integer height;
    private String education;
    private String profession;
    private String employedIn;
    private Integer annualIncome;
    private String city;
    private String mobile;
    private String district;
    private String state;
    private String country;
    private String religion;
    private String caste;
    private String subCaste;
    private String dosham;
    private Boolean willingOtherCaste;
    private String maritalStatus;
    private String familyStatus;
    private String familyType;
    private String about;
    private Integer minAge;
    private Integer maxAge;
}