package com.matrimony.eliteinovamatrimonybackend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_preferences")
public class MatchPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Age Preferences
    private Integer minAge;
    private Integer maxAge;

    // Height Preferences
    private Double minHeight;
    private Double maxHeight;

    // Marital Status Preferences
    private String maritalStatus;

    // Religious Preferences
    private String religion;
    private String caste;
    private String subCaste;

    // Professional Preferences
    private String education;
    private String employmentType;
    private String profession;
    private Double minIncome;

    // Location Preferences
    private String preferredState;
    private String preferredDistrict;
    private String preferredCity;

    // Dosham Preferences
    private String doshamPreference; // "YES", "NO", "BOTH"

    // Family Preferences
    private String familyType; // "JOINT", "NUCLEAR", "BOTH"
    private String familyStatus;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors
    public MatchPreferences() {}

    public MatchPreferences(User user) {
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getMinAge() { return minAge; }
    public void setMinAge(Integer minAge) { this.minAge = minAge; }

    public Integer getMaxAge() { return maxAge; }
    public void setMaxAge(Integer maxAge) { this.maxAge = maxAge; }

    public Double getMinHeight() { return minHeight; }
    public void setMinHeight(Double minHeight) { this.minHeight = minHeight; }

    public Double getMaxHeight() { return maxHeight; }
    public void setMaxHeight(Double maxHeight) { this.maxHeight = maxHeight; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getCaste() { return caste; }
    public void setCaste(String caste) { this.caste = caste; }

    public String getSubCaste() { return subCaste; }
    public void setSubCaste(String subCaste) { this.subCaste = subCaste; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public Double getMinIncome() { return minIncome; }
    public void setMinIncome(Double minIncome) { this.minIncome = minIncome; }

    public String getPreferredState() { return preferredState; }
    public void setPreferredState(String preferredState) { this.preferredState = preferredState; }

    public String getPreferredDistrict() { return preferredDistrict; }
    public void setPreferredDistrict(String preferredDistrict) { this.preferredDistrict = preferredDistrict; }

    public String getPreferredCity() { return preferredCity; }
    public void setPreferredCity(String preferredCity) { this.preferredCity = preferredCity; }

    public String getDoshamPreference() { return doshamPreference; }
    public void setDoshamPreference(String doshamPreference) { this.doshamPreference = doshamPreference; }

    public String getFamilyType() { return familyType; }
    public void setFamilyType(String familyType) { this.familyType = familyType; }

    public String getFamilyStatus() { return familyStatus; }
    public void setFamilyStatus(String familyStatus) { this.familyStatus = familyStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}