// ProfileSearchRequest.java - add the missing location field
package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;

@Data
public class ProfileSearchRequest {
    // Personal details
    private String gender;
    private Integer minAge;
    private Integer maxAge;
    private String religion;
    private String caste;
    private String subCaste;
    private String maritalStatus;

    // Professional details
    private String education;
    private String profession;
    private String occupation;
    private String employedIn;
    private String annualIncome;

    // Location details
    private String location; // ✅ ADD THIS FIELD
    private String country;
    private String state;
    private String district;

    // Additional filters
    private String category;
    private String dosham;

    // Pagination
    private Integer page = 0;
    private Integer size = 12;
    private String sortBy = "createdAt";
    private String sortDirection = "DESC";
}