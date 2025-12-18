package com.matrimony.eliteinovamatrimonybackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Details
    private String name;
    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender = Gender.MALE;

    // Physical Attributes
    private Integer height; // in cm

    // Education & Career
    private String education;
    private String profession;
    private String employedIn;
    private Integer annualIncome; // in rupees

    // Location
    private String city;
    private String district;
    private String state;
    private String country = "India";

    // Religion & Community
    private String religion;
    private String caste;
    private String subCaste;
    private String dosham;
    private Boolean willingOtherCaste = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaritalStatus maritalStatus = MaritalStatus.NEVER_MARRIED;

    // Family Details
    private String familyStatus;
    private String familyType;

    private String mobile;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    // Profile Details
    @Column(columnDefinition = "TEXT")
    private String about;

    @ElementCollection
    @CollectionTable(name = "profile_photos", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "photos") // ✅ ADDED: Specify column name
    private List<String> photos = new ArrayList<>();

    private Boolean isVerified = false;
    private Boolean isPremium = false;

    private String category;
    private String occupation;
    private String motherTongue;
    private String profileFor;

    // Timestamps
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    // Relationships
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Enums
    public enum Gender {
        MALE, FEMALE
    }

    public enum MaritalStatus {
        NEVER_MARRIED, DIVORCED, WIDOWED, SEPARATED
    }

    // Safe conversion methods
    public static MaritalStatus safeMaritalStatus(String status) {
        if (status == null) return MaritalStatus.NEVER_MARRIED;
        try {
            return MaritalStatus.valueOf(status.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return MaritalStatus.NEVER_MARRIED;
        }
    }

    public static Gender safeGender(String gender) {
        if (gender == null) return Gender.MALE;
        try {
            return Gender.valueOf(gender.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Gender.MALE;
        }
    }
}