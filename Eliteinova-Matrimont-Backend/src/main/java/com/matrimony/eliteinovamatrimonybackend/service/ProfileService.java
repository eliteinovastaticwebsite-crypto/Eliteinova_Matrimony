package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.dto.*;
import com.matrimony.eliteinovamatrimonybackend.entity.Profile;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.repository.ProfileRepository;
import com.matrimony.eliteinovamatrimonybackend.specification.ProfileSpecification;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    // ✅ REMOVED: ProfilePhotoRepository dependency to avoid circular dependency
    // Photos will be handled separately in ProfilePhotoService

    // Get all profiles with pagination
    public Page<ProfileResponse> getAllProfiles(int page, int size, Profile.Gender loggedInUserGender) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // ✅ ADDED: Create specification for opposite gender + non-admin
        Specification<Profile> oppositeGenderSpec = ProfileSpecification.byOppositeGender(loggedInUserGender);
        Page<Profile> profiles = profileRepository.findAllNonAdminProfiles(oppositeGenderSpec, pageable);

        System.out.println("📊 Retrieved " + profiles.getTotalElements() + " opposite gender non-admin profiles");
        return profiles.map(this::convertToResponse);
    }

    // Search profiles with filters - UPDATED to include user's gender
    public Page<ProfileResponse> searchProfiles(ProfileSearchRequest searchRequest, Profile.Gender loggedInUserGender) {
        try {
            System.out.println("🔍 Starting profile search with filters: " + searchRequest);
            System.out.println("👤 Logged-in user gender: " + loggedInUserGender);

            // ✅ ADDED: Debug age filters specifically
            System.out.println("🎯 Age filters received - minAge: " + searchRequest.getMinAge() +
                    ", maxAge: " + searchRequest.getMaxAge() +
                    ", minAge type: " + (searchRequest.getMinAge() != null ? searchRequest.getMinAge().getClass().getSimpleName() : "null") +
                    ", maxAge type: " + (searchRequest.getMaxAge() != null ? searchRequest.getMaxAge().getClass().getSimpleName() : "null"));

            Sort sort = Sort.by(
                    searchRequest.getSortDirection().equalsIgnoreCase("DESC") ?
                            Sort.Direction.DESC : Sort.Direction.ASC,
                    searchRequest.getSortBy()
            );

            Pageable pageable = PageRequest.of(
                    searchRequest.getPage(),
                    searchRequest.getSize(),
                    sort
            );

            // Convert gender string to enum (this will be overridden by auto-gender logic)
            Profile.Gender genderEnum = null;
            if (searchRequest.getGender() != null && !searchRequest.getGender().trim().isEmpty()) {
                try {
                    genderEnum = Profile.Gender.valueOf(searchRequest.getGender().toUpperCase());
                    System.out.println("⚠️ Manual gender filter will be overridden by auto-gender logic: " + genderEnum);
                } catch (IllegalArgumentException e) {
                    System.out.println("⚠️ Invalid gender value: " + searchRequest.getGender());
                }
            }

            Profile.MaritalStatus maritalStatusEnum = null;
            if (searchRequest.getMaritalStatus() != null && !searchRequest.getMaritalStatus().trim().isEmpty()) {
                try {
                    String maritalStatus = searchRequest.getMaritalStatus().toUpperCase().replace(" ", "_");
                    // Handle common marital status formats
                    if (maritalStatus.equals("NEVER_MARRIED")) {
                        maritalStatusEnum = Profile.MaritalStatus.NEVER_MARRIED;
                    } else if (maritalStatus.equals("DIVORCED")) {
                        maritalStatusEnum = Profile.MaritalStatus.DIVORCED;
                    } else if (maritalStatus.equals("WIDOWED")) {
                        maritalStatusEnum = Profile.MaritalStatus.WIDOWED;
                    } else if (maritalStatus.equals("SEPARATED")) {
                        maritalStatusEnum = Profile.MaritalStatus.SEPARATED;
                    } else {
                        maritalStatusEnum = Profile.MaritalStatus.valueOf(maritalStatus);
                    }
                    System.out.println("✅ Marital status filter: " + maritalStatusEnum);
                } catch (IllegalArgumentException e) {
                    System.out.println("⚠️ Invalid marital status: " + searchRequest.getMaritalStatus());
                    // Try alternative format
                    try {
                        String altStatus = searchRequest.getMaritalStatus().toUpperCase().replace(" ", "");
                        maritalStatusEnum = Profile.MaritalStatus.valueOf(altStatus);
                        System.out.println("✅ Marital status filter (alt): " + maritalStatusEnum);
                    } catch (IllegalArgumentException ex) {
                        System.out.println("❌ Could not convert marital status: " + searchRequest.getMaritalStatus());
                    }
                }
            }

            // Use occupation if profession is not provided
            String professionToUse = searchRequest.getProfession();
            if ((professionToUse == null || professionToUse.trim().isEmpty()) &&
                    searchRequest.getOccupation() != null && !searchRequest.getOccupation().trim().isEmpty()) {
                professionToUse = searchRequest.getOccupation();
                System.out.println("✅ Using occupation as profession: " + professionToUse);
            }

            if (searchRequest.getProfession() != null && !searchRequest.getProfession().trim().isEmpty() &&
                    searchRequest.getOccupation() != null && !searchRequest.getOccupation().trim().isEmpty()) {
                System.out.println("⚠️ Both profession and occupation provided, using profession: " + searchRequest.getProfession());
                professionToUse = searchRequest.getProfession();
            }

            // ✅ UPDATED: Pass loggedInUserGender as first parameter
            Specification<Profile> spec = ProfileSpecification.withFilters(
                    loggedInUserGender,
                    genderEnum,
                    searchRequest.getMinAge(),
                    searchRequest.getMaxAge(),
                    searchRequest.getReligion(),
                    searchRequest.getCategory(),      // <-- ADDED: category
                    searchRequest.getCaste(),
                    searchRequest.getSubCaste(),
                    maritalStatusEnum,
                    searchRequest.getEducation(),
                    professionToUse,
                    searchRequest.getLocation(),
                    searchRequest.getEmployedIn(),
                    searchRequest.getDosham(),
                    searchRequest.getAnnualIncome(),
                    searchRequest.getCountry(),
                    searchRequest.getState(),
                    searchRequest.getDistrict()
            );

            // ✅ FIXED: Use the new method that combines specification with admin exclusion
            Page<Profile> profiles = profileRepository.findAllNonAdminProfiles(spec, pageable);

            System.out.println("✅ Search completed. Found " + profiles.getTotalElements() + " non-admin profiles");

            return profiles.map(this::convertToResponse);

        } catch (Exception e) {
            System.out.println("❌ Error in searchProfiles: " + e.getMessage());
            e.printStackTrace();
            // Return empty page on error
            return Page.empty();
        }
    }

    // Get profile by ID
    public Optional<ProfileResponse> getProfileById(Long id) {
        return profileRepository.findById(id).map(this::convertToResponse);
    }

    // Get profiles by gender
    public Page<ProfileResponse> getProfilesByGender(Profile.Gender gender, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // Create specification for gender + non-admin
        Specification<Profile> genderSpec = ProfileSpecification.byGender(gender);
        Page<Profile> profiles = profileRepository.findAllNonAdminProfiles(genderSpec, pageable);

        return profiles.map(this::convertToResponse);
    }

    // Get profiles by community
    public Page<ProfileResponse> getProfilesByCommunity(String community, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Profile> profiles = profileRepository.findByCaste(community, pageable);
        return profiles.map(this::convertToResponse);
    }

    // Get profiles by religion with opposite gender logic
    public Page<ProfileResponse> getProfilesByReligion(String religion, int page, int size, Profile.Gender loggedInUserGender) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // ✅ UPDATED: Combine religion and opposite gender specifications (FIXED deprecated syntax)
        Specification<Profile> religionSpec = ProfileSpecification.byReligion(religion);
        Specification<Profile> oppositeGenderSpec = ProfileSpecification.byOppositeGender(loggedInUserGender);

        // ✅ FIXED: Use non-deprecated syntax for combining specifications
        Specification<Profile> combinedSpec = oppositeGenderSpec.and(religionSpec);

        Page<Profile> profiles = profileRepository.findAllNonAdminProfiles(combinedSpec, pageable);

        return profiles.map(this::convertToResponse);
    }

    // In ProfileService.java - Add this method
    @PersistenceContext
    private EntityManager entityManager;

    // Add this method to get photos using native query
    private List<String> getProfilePhotosFromDatabase(Long profileId) {
        try {
            String sql = "SELECT photos FROM profile_photos WHERE profile_id = ?";
            Query query = entityManager.createNativeQuery(sql);
            query.setParameter(1, profileId);

            @SuppressWarnings("unchecked")
            List<String> photoUrls = query.getResultList();

            // Filter out any null values
            List<String> filteredUrls = photoUrls.stream()
                    .filter(url -> url != null && !url.trim().isEmpty())
                    .collect(Collectors.toList());

            System.out.println("✅ Native query found " + filteredUrls.size() + " photos for profile " + profileId);
            return filteredUrls;
        } catch (Exception e) {
            System.out.println("❌ Error fetching photos with native query: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Update the convertToResponse method
    public ProfileResponse convertToResponse(Profile profile) {
        ProfileResponse response = new ProfileResponse();
        response.setId(profile.getId());
        response.setName(profile.getName());
        response.setAge(profile.getAge());
        response.setGender(profile.getGender().toString());
        response.setHeight(profile.getHeight());
        response.setEducation(profile.getEducation());
        response.setProfession(profile.getProfession());

        System.out.println("🔍 DEBUG - Profile fields in convertToResponse:");
        System.out.println("   Mobile: " + profile.getMobile());
        System.out.println("   Specialization: " + profile.getSpecialization());
        System.out.println("   MinAge: " + profile.getMinAge());
        System.out.println("   MaxAge: " + profile.getMaxAge());

        // Location formatting
        String location = "";
        if (profile.getCity() != null && profile.getState() != null) {
            location = profile.getCity() + ", " + profile.getState();
        } else if (profile.getCity() != null) {
            location = profile.getCity();
        } else if (profile.getState() != null) {
            location = profile.getState();
        } else if (profile.getDistrict() != null) {
            location = profile.getDistrict();
        }
        response.setLocation(location);

        response.setReligion(profile.getReligion());
        response.setCaste(profile.getCaste());
        response.setSubCaste(profile.getSubCaste());
        response.setMaritalStatus(profile.getMaritalStatus().toString());
        response.setFamilyStatus(profile.getFamilyStatus());
        response.setFamilyType(profile.getFamilyType());
        response.setAnnualIncome(profile.getAnnualIncome());
        response.setAbout(profile.getAbout());
        response.setIsVerified(profile.getIsVerified());
        response.setIsPremium(profile.getIsPremium());
        response.setDosham(profile.getDosham());
        response.setEmployedIn(profile.getEmployedIn());
        response.setDistrict(profile.getDistrict());
        response.setState(profile.getState());
        response.setCountry(profile.getCountry());
        response.setCreatedAt(profile.getCreatedAt());
        response.setMobile(profile.getMobile());
        response.setSpecialization(profile.getSpecialization());
        response.setMinAge(profile.getMinAge());
        response.setMaxAge(profile.getMaxAge());

        System.out.println("✅ DEBUG - ProfileResponse fields after mapping:");
        System.out.println("   Response Mobile: " + response.getMobile());
        System.out.println("   Response Specialization: " + response.getSpecialization());
        System.out.println("   Response MinAge: " + response.getMinAge());
        System.out.println("   Response MaxAge: " + response.getMaxAge());

        // ✅ FIXED: Use ONLY ElementCollection photos (remove native query)
        List<String> allPhotos = new ArrayList<>();

        // 1. Add photos from ElementCollection only
        if (profile.getPhotos() != null && !profile.getPhotos().isEmpty()) {
            allPhotos.addAll(profile.getPhotos());
        }

        response.setPhotos(allPhotos);
        System.out.println("🎯 Profile " + profile.getId() + " - Total photos: " + allPhotos.size());
        if (!allPhotos.isEmpty()) {
            System.out.println("📸 Photos: " + allPhotos);
        }

        // User info
        if (profile.getUser() != null) {
            if (profile.getUser().getId() != null) {
                response.setUserId(profile.getUser().getId());
            }
            if (profile.getUser().getEmail() != null) {
                response.setUserEmail(profile.getUser().getEmail());
            }
        }

        return response;
    }

    // Create or update profile
    public ProfileResponse createOrUpdateProfile(Profile profile, User user) {
        try {
            System.out.println("💾 Saving profile for user: " + user.getId());

            // Set the user relationship
            profile.setUser(user);

            // Set timestamps
            if (profile.getId() == null) {
                profile.setCreatedAt(LocalDateTime.now());
            }
            profile.setUpdatedAt(LocalDateTime.now());

            Profile savedProfile = profileRepository.save(profile);
            System.out.println("✅ Profile saved successfully with ID: " + savedProfile.getId());

            return convertToResponse(savedProfile);
        } catch (Exception e) {
            System.out.println("❌ Error saving profile: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save profile: " + e.getMessage(), e);
        }
    }

    // ✅ ADDED: Simple profile creation (for registration)
    public Profile createProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    // Get profile by user ID
    public Optional<ProfileResponse> getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId).map(this::convertToResponse);
    }

    // Get profile entity by user ID
    public Optional<Profile> getProfileEntityByUserId(Long userId) {
        return profileRepository.findByUserId(userId);
    }

    // Check if user has profile
    public boolean userHasProfile(Long userId) {
        return profileRepository.existsByUserId(userId);
    }

    // Update profile verification status
    public ProfileResponse updateVerificationStatus(Long profileId, boolean isVerified) {
        return profileRepository.findById(profileId).map(profile -> {
            profile.setIsVerified(isVerified);
            profile.setUpdatedAt(LocalDateTime.now());
            Profile savedProfile = profileRepository.save(profile);
            return convertToResponse(savedProfile);
        }).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    // Get featured profiles
    public List<ProfileResponse> getFeaturedProfiles(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Profile> profiles = profileRepository.findByIsVerifiedTrue(pageable);
        return profiles.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get premium profiles
    public List<ProfileResponse> getPremiumProfiles(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Profile> profiles = profileRepository.findByIsPremiumTrue(pageable);
        return profiles.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get recent profiles
    public List<ProfileResponse> getRecentProfiles(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Profile> profiles = profileRepository.findByOrderByCreatedAtDesc(pageable);
        return profiles.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get match stats
    public StatsResponse getMatchStats() {
        StatsResponse stats = new StatsResponse();
        stats.setTotalProfiles(profileRepository.countTotalProfiles());
        stats.setMaleProfiles(profileRepository.countMaleProfiles());
        stats.setFemaleProfiles(profileRepository.countFemaleProfiles());
        stats.setVerifiedProfiles(profileRepository.countVerifiedProfiles());
        stats.setPremiumProfiles(profileRepository.countPremiumProfiles());
        stats.setRecentProfiles(profileRepository.countNewProfilesToday());

        // Religion statistics
        Map<String, Long> religionStats = new HashMap<>();
        List<Object[]> religionData = profileRepository.countProfilesByReligion();
        for (Object[] data : religionData) {
            religionStats.put((String) data[0], (Long) data[1]);
        }
        stats.setByReligion(religionStats);

        // Community statistics
        Map<String, Long> communityStats = new HashMap<>();
        List<Object[]> communityData = profileRepository.countProfilesByCaste();
        for (Object[] data : communityData) {
            communityStats.put((String) data[0], (Long) data[1]);
        }
        stats.setByCommunity(communityStats);

        stats.setLastUpdated(LocalDateTime.now().toString());
        return stats;
    }

    // Get community stats
    public Map<String, Long> getCommunityStats() {
        Map<String, Long> stats = new HashMap<>();
        List<Object[]> data = profileRepository.countProfilesByCaste();
        for (Object[] item : data) {
            stats.put((String) item[0], (Long) item[1]);
        }
        return stats;
    }

    // ✅ ADDED: Method to get featured profiles with gender filtering
    public List<ProfileResponse> getFeaturedProfiles(int limit, Profile.Gender loggedInUserGender) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));

        // ✅ ADDED: Combine featured and opposite gender specifications (FIXED deprecated syntax)
        Specification<Profile> featuredSpec = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isVerified"), true);
        Specification<Profile> oppositeGenderSpec = ProfileSpecification.byOppositeGender(loggedInUserGender);

        // ✅ FIXED: Use non-deprecated syntax for combining specifications
        Specification<Profile> combinedSpec = oppositeGenderSpec.and(featuredSpec);

        Page<Profile> profiles = profileRepository.findAllNonAdminProfiles(combinedSpec, pageable);
        return profiles.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ ADDED: Method to get premium profiles with gender filtering
    public List<ProfileResponse> getPremiumProfiles(int limit, Profile.Gender loggedInUserGender) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));

        // ✅ ADDED: Combine premium and opposite gender specifications (FIXED deprecated syntax)
        Specification<Profile> premiumSpec = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isPremium"), true);
        Specification<Profile> oppositeGenderSpec = ProfileSpecification.byOppositeGender(loggedInUserGender);

        // ✅ FIXED: Use non-deprecated syntax for combining specifications
        Specification<Profile> combinedSpec = oppositeGenderSpec.and(premiumSpec);

        Page<Profile> profiles = profileRepository.findAllNonAdminProfiles(combinedSpec, pageable);
        return profiles.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ ADDED: Method to get recent profiles with gender filtering
    public List<ProfileResponse> getRecentProfiles(int limit, Profile.Gender loggedInUserGender) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));

        // ✅ ADDED: Combine recent and opposite gender specifications (FIXED deprecated syntax)
        Specification<Profile> recentSpec = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction(); // No additional filter for recent
        Specification<Profile> oppositeGenderSpec = ProfileSpecification.byOppositeGender(loggedInUserGender);

        // ✅ FIXED: Use non-deprecated syntax for combining specifications
        Specification<Profile> combinedSpec = oppositeGenderSpec.and(recentSpec);

        Page<Profile> profiles = profileRepository.findAllNonAdminProfiles(combinedSpec, pageable);
        return profiles.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ ADDED: Overloaded method for backward compatibility
    public Page<ProfileResponse> getAllProfiles(int page, int size) {
        return getAllProfiles(page, size, null);
    }

    // ✅ ADDED: Overloaded method for backward compatibility
    public Page<ProfileResponse> searchProfiles(ProfileSearchRequest searchRequest) {
        return searchProfiles(searchRequest, null);
    }

    // ✅ ADDED: Overloaded method for backward compatibility
    public Page<ProfileResponse> getProfilesByReligion(String religion, int page, int size) {
        return getProfilesByReligion(religion, page, size, null);
    }

    // Add this method to ProfileService (anywhere inside the class)
    public Optional<Profile> getProfileEntityById(Long id) {
        return profileRepository.findById(id);
    }
}