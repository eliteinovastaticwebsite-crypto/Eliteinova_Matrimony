package com.matrimony.eliteinovamatrimonybackend.dto;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Please provide a valid Indian mobile number")
    private String mobile;

    // Profile Information
    private String profileFor = "Myself";

    @NotBlank(message = "Gender is required")
    private String gender = "Male";

    private String dob;

    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must be less than 100")
    private Integer age;

    // Professional Details
    private String education;
    private String profession;
    private String occupation;
    private String employedIn;
    private String specialization; // ✅ ADDED: Missing field

    @Min(value = 0, message = "Annual income cannot be negative")
    private Integer annualIncome;

    // Location
    private String city;
    private String district;
    private String state;
    private String country = "India";
    private String pincode; // ✅ ADDED: Missing field

    // Religion & Community
    private String religion;
    private String caste;
    private String subCaste;
    private String dosham;
    private Boolean willingOtherCaste = false;

    // Personal Details
    private String maritalStatus = "Never Married";
    private String familyStatus;
    private String familyType;

    @Min(value = 100, message = "Height must be at least 100 cm")
    @Max(value = 250, message = "Height must be less than 250 cm")
    private Integer height;

    @Size(max = 1000, message = "About yourself cannot exceed 1000 characters")
    private String about;

    // Family Details - ✅ ADDED: Missing fields
    private String childrenCount = "0"; // Store as string to match frontend
    private Boolean childrenWithYou = false;

    // Search Preferences
    @Min(value = 18, message = "Minimum age must be at least 18")
    @Max(value = 100, message = "Minimum age must be less than 100")
    private Integer minAge;

    @Min(value = 18, message = "Maximum age must be at least 18")
    @Max(value = 100, message = "Maximum age must be less than 100")
    private Integer maxAge;

    // Constructors
    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, String mobile) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getProfileFor() { return profileFor; }
    public void setProfileFor(String profileFor) { this.profileFor = profileFor; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getEmployedIn() { return employedIn; }
    public void setEmployedIn(String employedIn) { this.employedIn = employedIn; }

    public String getSpecialization() { return specialization; } // ✅ ADDED
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Integer getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(Integer annualIncome) { this.annualIncome = annualIncome; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPincode() { return pincode; } // ✅ ADDED
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getCaste() { return caste; }
    public void setCaste(String caste) { this.caste = caste; }

    public String getSubCaste() { return subCaste; }
    public void setSubCaste(String subCaste) { this.subCaste = subCaste; }

    public String getDosham() { return dosham; }
    public void setDosham(String dosham) { this.dosham = dosham; }

    public Boolean getWillingOtherCaste() { return willingOtherCaste; }
    public void setWillingOtherCaste(Boolean willingOtherCaste) { this.willingOtherCaste = willingOtherCaste; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public String getFamilyStatus() { return familyStatus; }
    public void setFamilyStatus(String familyStatus) { this.familyStatus = familyStatus; }

    public String getFamilyType() { return familyType; }
    public void setFamilyType(String familyType) { this.familyType = familyType; }

    public Integer getHeight() { return height; }
    public void setHeight(Integer height) { this.height = height; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    // ✅ ADDED: Missing fields - Family details
    public String getChildrenCount() { return childrenCount; }
    public void setChildrenCount(String childrenCount) { this.childrenCount = childrenCount; }

    public Boolean getChildrenWithYou() { return childrenWithYou; }
    public void setChildrenWithYou(Boolean childrenWithYou) { this.childrenWithYou = childrenWithYou; }

    public Integer getMinAge() { return minAge; }
    public void setMinAge(Integer minAge) { this.minAge = minAge; }

    public Integer getMaxAge() { return maxAge; }
    public void setMaxAge(Integer maxAge) { this.maxAge = maxAge; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    // Enhanced validation methods
    public boolean validateAgeRange() {
        if (minAge == null || maxAge == null) return true;
        return minAge <= maxAge;
    }

    public boolean validateChildrenFields() {
        // If childrenCount is provided and > 0, childrenWithYou should not be null
        if (childrenCount != null && !childrenCount.equals("0") && !childrenCount.equals("0")) {
            return childrenWithYou != null;
        }
        return true;
    }

    @Override
    public String toString() {
        return "RegisterRequest{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", mobile='" + mobile + '\'' +
                ", profileFor='" + profileFor + '\'' +
                ", gender='" + gender + '\'' +
                ", age=" + age +
                ", maritalStatus='" + maritalStatus + '\'' +
                ", childrenCount='" + childrenCount + '\'' +
                ", childrenWithYou=" + childrenWithYou +
                ", minAge=" + minAge +
                ", maxAge=" + maxAge +
                '}';
    }
}