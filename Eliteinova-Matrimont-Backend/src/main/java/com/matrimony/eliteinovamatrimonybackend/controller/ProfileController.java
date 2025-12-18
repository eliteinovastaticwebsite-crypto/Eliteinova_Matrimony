package com.matrimony.eliteinovamatrimonybackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matrimony.eliteinovamatrimonybackend.dto.*;
import com.matrimony.eliteinovamatrimonybackend.entity.ContactRequest;
import com.matrimony.eliteinovamatrimonybackend.entity.Notification;
import com.matrimony.eliteinovamatrimonybackend.entity.Profile;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.repository.ContactRequestRepository;
import com.matrimony.eliteinovamatrimonybackend.service.ContactRequestService;
import com.matrimony.eliteinovamatrimonybackend.service.NotificationService;
import com.matrimony.eliteinovamatrimonybackend.service.ProfileService;
import com.matrimony.eliteinovamatrimonybackend.service.UserService;
import com.matrimony.eliteinovamatrimonybackend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private final ContactRequestService contactRequestService;

    @Autowired
    private NotificationService  notificationService;

    @Autowired
    private ContactRequestRepository contactRequestRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public ProfileController(ContactRequestService contactRequestService, NotificationService notificationService, ContactRequestRepository contactRequestRepository) {
        this.contactRequestService = contactRequestService;
        this.notificationService = notificationService;
        this.contactRequestRepository = contactRequestRepository;

    }

    // === GET ALL PROFILES (PAGINATED) ===
    @GetMapping
    public ResponseEntity<?> getAllProfiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) { // ✅ ADDED: authorizationHeader
        try {
            // ✅ ADDED: Get logged-in user's gender
            Profile.Gender loggedInUserGender = getLoggedInUserGender(authorizationHeader);
            System.out.println("👤 Logged-in user gender for getAllProfiles: " + loggedInUserGender);

            Page<ProfileResponse> profiles = profileService.getAllProfiles(page, size, loggedInUserGender); // ✅ UPDATED: Pass gender

            // ✅ FIXED: Ensure all profiles have safe maritalStatus values
            List<ProfileResponse> safeProfiles = profiles.getContent().stream()
                    .map(this::ensureSafeMaritalStatus)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("content", safeProfiles);
            response.put("totalElements", profiles.getTotalElements());
            response.put("totalPages", profiles.getTotalPages());
            response.put("size", profiles.getSize());
            response.put("number", profiles.getNumber());
            response.put("first", profiles.isFirst());
            response.put("last", profiles.isLast());
            response.put("numberOfElements", profiles.getNumberOfElements());
            response.put("empty", profiles.isEmpty());
            response.put("success", true);
            response.put("loggedInUserGender", loggedInUserGender != null ? loggedInUserGender.toString() : "UNKNOWN"); // ✅ ADDED: Debug info

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch profiles: " + e.getMessage()));
        }
    }

    // ✅ FIXED: Helper method to ensure safe maritalStatus values
    private ProfileResponse ensureSafeMaritalStatus(ProfileResponse profile) {
        if (profile != null && profile.getMaritalStatus() == null) {
            profile.setMaritalStatus("NEVER_MARRIED"); // ✅ CHANGED: NOT_SPECIFIED -> NEVER_MARRIED
        }
        return profile;
    }

    // ✅ FIXED: Safe gender conversion method
    private Profile.Gender safeConvertGender(String gender) {
        if (gender == null) return Profile.Gender.MALE; // Default to MALE
        try {
            return Profile.Gender.valueOf(gender.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Profile.Gender.MALE; // Default fallback
        }
    }

    // ✅ FIXED: Safe marital status conversion method (REMOVED NOT_SPECIFIED)
    private Profile.MaritalStatus safeConvertMaritalStatus(String status) {
        if (status == null) return Profile.MaritalStatus.NEVER_MARRIED; // ✅ CHANGED
        try {
            return Profile.MaritalStatus.valueOf(status.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return Profile.MaritalStatus.NEVER_MARRIED; // ✅ CHANGED
        }
    }

    // === SEARCH PROFILES WITH FILTERS ===
    @PostMapping("/search")
    public ResponseEntity<?> searchProfiles(
            @RequestBody ProfileSearchRequest searchRequest,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            // ✅ ADD THESE DEBUG LOGS RIGHT HERE:
            System.out.println("🎯 DEBUG - Received search request:");
            System.out.println("   minAge: " + searchRequest.getMinAge());
            System.out.println("   maxAge: " + searchRequest.getMaxAge());
            System.out.println("   occupation: " + searchRequest.getOccupation());
            System.out.println("   profession: " + searchRequest.getProfession());
            System.out.println("   gender: " + searchRequest.getGender());
            System.out.println("   country: " + searchRequest.getCountry());
            System.out.println("🎯 CASTE/RELIGION DEBUG - Received search request:");
            System.out.println("   religion: " + searchRequest.getReligion());
            System.out.println("   caste: " + searchRequest.getCaste());
            System.out.println("   subCaste: " + searchRequest.getSubCaste());
            System.out.println("   category: " + searchRequest.getCategory());

            // Print the entire request object as JSON to see all fields
            ObjectMapper mapper = new ObjectMapper();
            System.out.println("📦 FULL REQUEST: " + mapper.writeValueAsString(searchRequest));

            // ✅ ADDED: Get logged-in user's gender
            Profile.Gender loggedInUserGender = getLoggedInUserGender(authorizationHeader);
            System.out.println("👤 Logged-in user gender for search: " + loggedInUserGender);

            Page<ProfileResponse> profiles = profileService.searchProfiles(searchRequest, loggedInUserGender);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("profiles", profiles.getContent());
            response.put("content", profiles.getContent());
            response.put("total", profiles.getTotalElements());
            response.put("totalElements", profiles.getTotalElements());
            response.put("filters", searchRequest);
            response.put("loggedInUserGender", loggedInUserGender != null ? loggedInUserGender.toString() : "UNKNOWN"); // ✅ ADDED: Debug info

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Search failed: " + e.getMessage()));
        }
    }

    // === GET PROFILE BY ID ===
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfileById(@PathVariable Long id) {
        try {
            Optional<ProfileResponse> profileOpt = profileService.getProfileById(id);

            if (profileOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("profile", profileOpt.get());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body(createErrorResponse("Profile not found"));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch profile: " + e.getMessage()));
        }
    }

    // === GET PROFILES BY COMMUNITY ===
    @GetMapping("/community/{community}")
    public ResponseEntity<?> getProfilesByCommunity(
            @PathVariable String community,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) { // ✅ ADDED: authorizationHeader
        try {
            // ✅ ADDED: Get logged-in user's gender
            Profile.Gender loggedInUserGender = getLoggedInUserGender(authorizationHeader);
            System.out.println("👤 Logged-in user gender for community: " + loggedInUserGender);

            ProfileSearchRequest searchRequest = new ProfileSearchRequest();
            searchRequest.setCaste(community);
            searchRequest.setPage(page);
            searchRequest.setSize(size);

            Page<ProfileResponse> profiles = profileService.searchProfiles(searchRequest, loggedInUserGender); // ✅ UPDATED: Pass gender

            Map<String, Object> response = new HashMap<>();
            response.put("content", profiles.getContent());
            response.put("totalElements", profiles.getTotalElements());
            response.put("totalPages", profiles.getTotalPages());
            response.put("size", profiles.getSize());
            response.put("number", profiles.getNumber());
            response.put("community", community);
            response.put("first", profiles.isFirst());
            response.put("last", profiles.isLast());
            response.put("success", true);
            response.put("loggedInUserGender", loggedInUserGender != null ? loggedInUserGender.toString() : "UNKNOWN"); // ✅ ADDED: Debug info

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch community profiles: " + e.getMessage()));
        }
    }

    // === GET PROFILES BY RELIGION ===
    @GetMapping("/religion/{religion}")
    public ResponseEntity<?> getProfilesByReligion(
            @PathVariable String religion,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) { // ✅ ADDED: authorizationHeader
        try {
            // ✅ ADDED: Get logged-in user's gender
            Profile.Gender loggedInUserGender = getLoggedInUserGender(authorizationHeader);
            System.out.println("👤 Logged-in user gender for religion: " + loggedInUserGender);

            ProfileSearchRequest searchRequest = new ProfileSearchRequest();
            searchRequest.setReligion(religion);
            searchRequest.setPage(page);
            searchRequest.setSize(size);

            Page<ProfileResponse> profiles = profileService.searchProfiles(searchRequest, loggedInUserGender); // ✅ UPDATED: Pass gender

            Map<String, Object> response = new HashMap<>();
            response.put("content", profiles.getContent());
            response.put("totalElements", profiles.getTotalElements());
            response.put("totalPages", profiles.getTotalPages());
            response.put("size", profiles.getSize());
            response.put("number", profiles.getNumber());
            response.put("religion", religion);
            response.put("first", profiles.isFirst());
            response.put("last", profiles.isLast());
            response.put("success", true);
            response.put("loggedInUserGender", loggedInUserGender != null ? loggedInUserGender.toString() : "UNKNOWN"); // ✅ ADDED: Debug info

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch religion profiles: " + e.getMessage()));
        }
    }

    // === GET PROFILES BY GENDER ===
    @GetMapping("/gender/{gender}")
    public ResponseEntity<?> getProfilesByGender(
            @PathVariable String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) { // ✅ ADDED: authorizationHeader
        try {
            // ✅ ADDED: Get logged-in user's gender
            Profile.Gender loggedInUserGender = getLoggedInUserGender(authorizationHeader);
            System.out.println("👤 Logged-in user gender for gender filter: " + loggedInUserGender);

            // Use search directly without enum conversion
            ProfileSearchRequest searchRequest = new ProfileSearchRequest();
            searchRequest.setGender(gender);
            searchRequest.setPage(page);
            searchRequest.setSize(size);

            Page<ProfileResponse> profiles = profileService.searchProfiles(searchRequest, loggedInUserGender); // ✅ UPDATED: Pass gender

            Map<String, Object> response = new HashMap<>();
            response.put("content", profiles.getContent());
            response.put("totalElements", profiles.getTotalElements());
            response.put("totalPages", profiles.getTotalPages());
            response.put("size", profiles.getSize());
            response.put("number", profiles.getNumber());
            response.put("gender", gender);
            response.put("first", profiles.isFirst());
            response.put("last", profiles.isLast());
            response.put("success", true);
            response.put("loggedInUserGender", loggedInUserGender != null ? loggedInUserGender.toString() : "UNKNOWN"); // ✅ ADDED: Debug info

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch gender profiles: " + e.getMessage()));
        }
    }

    // === GET MATCH STATISTICS ===
    @GetMapping("/stats")
    public ResponseEntity<?> getMatchStats() {
        try {
            StatsResponse stats = createBasicStats();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            response.put("lastUpdated", stats.getLastUpdated());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch statistics: " + e.getMessage()));
        }
    }

    // === GET COMMUNITY STATISTICS ===
    @GetMapping("/stats/community")
    public ResponseEntity<?> getCommunityStats() {
        try {
            Map<String, Long> stats = new HashMap<>();
            stats.put("Total", profileService.getAllProfiles(0, 1, null).getTotalElements()); // ✅ UPDATED: Pass null for gender

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("statistics", stats);
            response.put("totalProfiles", stats.get("Total"));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch community statistics: " + e.getMessage()));
        }
    }

    // === GET FEATURED PROFILES ===
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedProfiles(
            @RequestParam(defaultValue = "6") int limit,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) { // ✅ ADDED: authorizationHeader
        try {
            // ✅ ADDED: Get logged-in user's gender
            Profile.Gender loggedInUserGender = getLoggedInUserGender(authorizationHeader);
            System.out.println("👤 Logged-in user gender for featured: " + loggedInUserGender);

            Page<ProfileResponse> verifiedProfiles = profileService.getAllProfiles(0, limit, loggedInUserGender); // ✅ UPDATED: Pass gender
            List<ProfileResponse> featuredProfiles = verifiedProfiles.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("featuredProfiles", featuredProfiles);
            response.put("total", featuredProfiles.size());
            response.put("loggedInUserGender", loggedInUserGender != null ? loggedInUserGender.toString() : "UNKNOWN"); // ✅ ADDED: Debug info

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch featured profiles: " + e.getMessage()));
        }
    }

    // === GET PREMIUM PROFILES ===
    @GetMapping("/premium")
    public ResponseEntity<?> getPremiumProfiles(
            @RequestParam(defaultValue = "8") int limit,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) { // ✅ ADDED: authorizationHeader
        try {
            // ✅ ADDED: Get logged-in user's gender
            Profile.Gender loggedInUserGender = getLoggedInUserGender(authorizationHeader);
            System.out.println("👤 Logged-in user gender for premium: " + loggedInUserGender);

            ProfileSearchRequest searchRequest = new ProfileSearchRequest();
            searchRequest.setPage(0);
            searchRequest.setSize(limit);

            Page<ProfileResponse> profiles = profileService.searchProfiles(searchRequest, loggedInUserGender); // ✅ UPDATED: Pass gender
            List<ProfileResponse> premiumProfiles = profiles.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("profiles", premiumProfiles);
            response.put("total", premiumProfiles.size());
            response.put("loggedInUserGender", loggedInUserGender != null ? loggedInUserGender.toString() : "UNKNOWN"); // ✅ ADDED: Debug info

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch premium profiles: " + e.getMessage()));
        }
    }

    // === GET RECENT PROFILES ===
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentProfiles(
            @RequestParam(defaultValue = "8") int limit,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) { // ✅ ADDED: authorizationHeader
        try {
            // ✅ ADDED: Get logged-in user's gender
            Profile.Gender loggedInUserGender = getLoggedInUserGender(authorizationHeader);
            System.out.println("👤 Logged-in user gender for recent: " + loggedInUserGender);

            Page<ProfileResponse> recentProfiles = profileService.getAllProfiles(0, limit, loggedInUserGender); // ✅ UPDATED: Pass gender

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("profiles", recentProfiles.getContent());
            response.put("total", recentProfiles.getNumberOfElements());
            response.put("loggedInUserGender", loggedInUserGender != null ? loggedInUserGender.toString() : "UNKNOWN"); // ✅ ADDED: Debug info

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch recent profiles: " + e.getMessage()));
        }
    }

    // === CREATE OR UPDATE PROFILE ===
    @PostMapping
    public ResponseEntity<?> createOrUpdateProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Profile profileRequest) {
        try {
            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid authentication token"));
            }

            // ✅ FIXED: Check if profile already exists for this user
            Optional<Profile> existingProfileOpt = profileService.getProfileEntityByUserId(user.getId());

            ProfileResponse profileResponse;

            if (existingProfileOpt.isPresent()) {
                // ✅ UPDATE existing profile
                Profile existingProfile = existingProfileOpt.get();
                updateProfileFromRequest(existingProfile, profileRequest);
                profileResponse = profileService.createOrUpdateProfile(existingProfile, user);
            } else {
                // ✅ CREATE new profile
                profileRequest.setUser(user);
                profileResponse = profileService.createOrUpdateProfile(profileRequest, user);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("profile", profileResponse);
            response.put("message", "Profile saved successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace(); // Add this for debugging
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to save profile: " + e.getMessage()));
        }
    }

    // ✅ ADDED: Helper method to update existing profile with new data
    private void updateProfileFromRequest(Profile existingProfile, Profile profileRequest) {
        // Update all fields from the request
        if (profileRequest.getName() != null) existingProfile.setName(profileRequest.getName());
        if (profileRequest.getAge() != null) existingProfile.setAge(profileRequest.getAge());
        if (profileRequest.getGender() != null) existingProfile.setGender(profileRequest.getGender());
        if (profileRequest.getHeight() != null) existingProfile.setHeight(profileRequest.getHeight());
        if (profileRequest.getEducation() != null) existingProfile.setEducation(profileRequest.getEducation());
        if (profileRequest.getProfession() != null) existingProfile.setProfession(profileRequest.getProfession());
        if (profileRequest.getOccupation() != null) existingProfile.setOccupation(profileRequest.getOccupation());
        if (profileRequest.getEmployedIn() != null) existingProfile.setEmployedIn(profileRequest.getEmployedIn());
        if (profileRequest.getAnnualIncome() != null) existingProfile.setAnnualIncome(profileRequest.getAnnualIncome());
        if (profileRequest.getReligion() != null) existingProfile.setReligion(profileRequest.getReligion());
        if (profileRequest.getCaste() != null) existingProfile.setCaste(profileRequest.getCaste());
        if (profileRequest.getSubCaste() != null && !profileRequest.getSubCaste().trim().isEmpty()) {
            existingProfile.setSubCaste(profileRequest.getSubCaste().trim());
        } else {
            existingProfile.setSubCaste(null); // reset subcast to optional behavior
        }
        if (profileRequest.getDosham() != null) existingProfile.setDosham(profileRequest.getDosham());
        if (profileRequest.getMaritalStatus() != null) existingProfile.setMaritalStatus(profileRequest.getMaritalStatus());
        if (profileRequest.getMotherTongue() != null) existingProfile.setMotherTongue(profileRequest.getMotherTongue());
        if (profileRequest.getCountry() != null) existingProfile.setCountry(profileRequest.getCountry());
        if (profileRequest.getState() != null) existingProfile.setState(profileRequest.getState());
        if (profileRequest.getDistrict() != null) existingProfile.setDistrict(profileRequest.getDistrict());
        if (profileRequest.getCity() != null) existingProfile.setCity(profileRequest.getCity());
        if (profileRequest.getFamilyStatus() != null) existingProfile.setFamilyStatus(profileRequest.getFamilyStatus());
        if (profileRequest.getFamilyType() != null) existingProfile.setFamilyType(profileRequest.getFamilyType());
        if (profileRequest.getWillingOtherCaste() != null) existingProfile.setWillingOtherCaste(profileRequest.getWillingOtherCaste());
        if (profileRequest.getProfileFor() != null) existingProfile.setProfileFor(profileRequest.getProfileFor());
        if (profileRequest.getCategory() != null) existingProfile.setCategory(profileRequest.getCategory());
        if (profileRequest.getAbout() != null) existingProfile.setAbout(profileRequest.getAbout());
        if (profileRequest.getMinAge() != null) existingProfile.setMinAge(profileRequest.getMinAge());
        if (profileRequest.getMaxAge() != null) existingProfile.setMaxAge(profileRequest.getMaxAge());
        if (profileRequest.getPhotos() != null) existingProfile.setPhotos(profileRequest.getPhotos());

        existingProfile.setUpdatedAt(LocalDateTime.now());
    }

    // === GET USER'S PROFILE ===
    @GetMapping("/my-profile")
    public ResponseEntity<?> getMyProfile(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid authentication token"));
            }

            Optional<ProfileResponse> profileOpt = profileService.getProfileByUserId(user.getId());

            if (profileOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("profile", profileOpt.get());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.ok(createErrorResponse("Profile not found for user"));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch profile: " + e.getMessage()));
        }
    }

    // ✅ ADDED: Helper method to create basic stats
    private StatsResponse createBasicStats() {
        StatsResponse stats = new StatsResponse();
        Page<ProfileResponse> allProfiles = profileService.getAllProfiles(0, 1, null); // ✅ UPDATED: Pass null for gender
        stats.setTotalProfiles(allProfiles.getTotalElements());
        stats.setMaleProfiles(0L);
        stats.setFemaleProfiles(0L);
        stats.setVerifiedProfiles(0L);
        stats.setPremiumProfiles(0L);
        stats.setRecentProfiles(0L);
        stats.setByReligion(new HashMap<>());
        stats.setByCommunity(new HashMap<>());
        stats.setLastUpdated(java.time.LocalDateTime.now().toString());
        return stats;
    }

    // ✅ ADDED: Helper method to extract logged-in user's gender from JWT token
    private Profile.Gender getLoggedInUserGender(String authorizationHeader) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                System.out.println("⚠️ No valid authorization header found");
                return null;
            }

            String token = authorizationHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<User> userOpt = userService.findByEmail(email);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("👤 Found user: " + user.getEmail() + " with gender: " + user.getGender());

                // ✅ FIXED: user.getGender() returns String, so we can directly convert it
                if (user.getGender() != null && !user.getGender().trim().isEmpty()) {
                    try {
                        // ✅ FIXED: Remove .name() call since user.getGender() is already a String
                        Profile.Gender profileGender = Profile.Gender.valueOf(user.getGender().toUpperCase());
                        System.out.println("✅ Converted to Profile.Gender: " + profileGender);
                        return profileGender;
                    } catch (IllegalArgumentException e) {
                        System.out.println("❌ Failed to convert gender string '" + user.getGender() + "' to Profile.Gender enum");
                        return null;
                    }
                }
            } else {
                System.out.println("❌ User not found for email: " + email);
            }
        } catch (Exception e) {
            System.out.println("⚠️ Error extracting user gender from token: " + e.getMessage());
        }
        return null;
    }

    // === HELPER METHODS ===
    private User extractUserFromToken(String authorizationHeader) {
    System.out.println("========== extractUserFromToken START ==========");
    
    if (authorizationHeader == null) {
        System.out.println("❌ Authorization header is null");
        System.out.println("========== extractUserFromToken END ==========");
        return null;
    }
    
    System.out.println("🔍 Authorization Header received: " + authorizationHeader);
    
    if (!authorizationHeader.startsWith("Bearer ")) {
        System.out.println("❌ Authorization header doesn't start with 'Bearer '");
        System.out.println("❌ Header starts with: " + (authorizationHeader.length() > 20 ? authorizationHeader.substring(0, 20) : authorizationHeader));
        System.out.println("========== extractUserFromToken END ==========");
        return null;
    }
    
    String token = authorizationHeader.substring(7);
    System.out.println("🔍 Token extracted, length: " + token.length());
    
    if (token.isEmpty()) {
        System.out.println("❌ Token is empty after removing 'Bearer '");
        System.out.println("========== extractUserFromToken END ==========");
        return null;
    }
    
    try {
        System.out.println("🔍 Validating JWT token...");
        
        // Check if token is valid
        boolean isValid = false;
        try {
            isValid = jwtUtil.validateToken(token);
            System.out.println("🔍 JWT validation result: " + isValid);
        } catch (Exception e) {
            System.out.println("❌ JWT validation threw exception: " + e.getMessage());
            System.out.println("❌ Exception type: " + e.getClass().getName());
            System.out.println("========== extractUserFromToken END ==========");
            return null;
        }
        
        if (!isValid) {
            System.out.println("❌ JWT token is invalid");
            System.out.println("========== extractUserFromToken END ==========");
            return null;
        }
        
        // Extract email from token
        System.out.println("🔍 Extracting email from token...");
        String email = null;
        try {
            email = jwtUtil.extractUsername(token);
            System.out.println("🔍 Email extracted: " + email);
        } catch (Exception e) {
            System.out.println("❌ Failed to extract email from token: " + e.getMessage());
            System.out.println("========== extractUserFromToken END ==========");
            return null;
        }
        
        if (email == null || email.isEmpty()) {
            System.out.println("❌ Email is null or empty");
            System.out.println("========== extractUserFromToken END ==========");
            return null;
        }
        
        // Find user in database
        System.out.println("🔍 Searching for user with email: " + email);
        Optional<User> userOpt = userService.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            System.out.println("✅ User found - ID: " + user.getId() + ", Name: " + user.getName());
            System.out.println("========== extractUserFromToken END ==========");
            return user;
        } else {
            System.out.println("❌ User not found in database for email: " + email);
            System.out.println("========== extractUserFromToken END ==========");
            return null;
        }
        
    } catch (Exception e) {
        System.out.println("❌ Unexpected exception in extractUserFromToken: " + e.getMessage());
        e.printStackTrace();
        System.out.println("========== extractUserFromToken END ==========");
        return null;
    }
}

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }

    @PostMapping(value = "/{profileId}/request-contact", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> requestContact(
            @PathVariable Long profileId,
            @RequestBody Map<String, Object> requestBody,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        ObjectMapper mapper = new ObjectMapper();

        try {
            User requester = extractUserFromToken(authorizationHeader);
            if (requester == null) {
                Map<String, Object> err = Map.of("success", false, "message", "Authentication required");
                return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(err);
            }

            // Find profile owner by profileId
            Optional<Profile> profileOpt = profileService.getProfileEntityById(profileId);
            if (profileOpt.isEmpty()) {
                Map<String, Object> err = Map.of("success", false, "message", "Profile not found");
                return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(err);
            }
            User profileOwner = profileOpt.get().getUser();

            // Extract parameters from request body
            String acceptedLanguage = (String) requestBody.getOrDefault("acceptedLanguage", "en");
            String note = (String) requestBody.get("note");

            ContactRequest saved = contactRequestService.createRequest(requester.getId(), profileOwner.getId(), acceptedLanguage, note);

            // Build response map
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("status", saved.getStatus().toString());
            resp.put("message", saved.getStatus() == ContactRequest.Status.PENDING ? "Request sent. Waiting for owner approval." : "Request processed.");
            if (saved.getStatus() == ContactRequest.Status.ACCEPTED) {
                Map<String, Object> contact = Map.of(
                        "phone", profileOwner.getMobile(),
                        "email", profileOwner.getEmail()
                );
                resp.put("contact", contact);
            }

            // --- NEW: create notification for profile owner (best-effort) ---
            try {
                String title = requester.getName() + " requested your contact";
                String message = requester.getName() + " has requested your contact details. Open Requests to review.";
                String actionUrl = "/profiles/" + profileId; // change to your frontend path if desired

                // Use the overloaded service method that accepts actionUrl
                notificationService.createNotification(profileOwner.getId(), title, message, "INTEREST", actionUrl);

                System.out.println("🔔 Notification enqueued for user " + profileOwner.getId());
            } catch (Exception nEx) {
                // Don't fail the request if notifications fail
                nEx.printStackTrace();
                System.out.println("⚠️ Failed to create notification: " + nEx.getMessage());
            }
            // --- END notification block ---

            // DEBUG log just before returning
            System.out.println("🔔 requestContact - RESP: " + mapper.writeValueAsString(resp));

            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(resp);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> err = Map.of("success", false, "message", "Failed to send request: " + e.getMessage());
            return ResponseEntity.status(500).contentType(MediaType.APPLICATION_JSON).body(err);
        }
    }

    @PostMapping(value = "/{profileId}/handle-request/{requestId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleContactRequest(
            @PathVariable Long profileId,
            @PathVariable Long requestId,
            @RequestBody Map<String, Object> requestBody,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        try {
            User owner = extractUserFromToken(authorizationHeader);
            if (owner == null) {
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }

            // verify owner owns profileId
            Optional<Profile> profileOpt = profileService.getProfileEntityById(profileId);
            if (profileOpt.isEmpty()) {
                System.out.println("❌ Profile not found for profileId: " + profileId);
                return ResponseEntity.status(404).body(createErrorResponse("Profile not found"));
            }

            Profile profile = profileOpt.get();
            if (profile.getUser() == null) {
                System.out.println("❌ Profile user is null for profileId: " + profileId);
                return ResponseEntity.status(500).body(createErrorResponse("Profile data error"));
            }

            Long profileOwnerId = profile.getUser().getId();
            System.out.println("🔍 Authorization check - profileId: " + profileId + ", ownerId: " + owner.getId() + ", profileOwnerId: " + profileOwnerId);

            if (!profileOwnerId.equals(owner.getId())) {
                System.out.println("❌ Authorization failed - user " + owner.getId() + " is not owner of profile " + profileId + " (owned by " + profileOwnerId + ")");
                return ResponseEntity.status(403).body(createErrorResponse("Unauthorized to handle requests for this profile"));
            }

            // Extract accept parameter from request body
            Boolean accept = (Boolean) requestBody.get("accept");
            if (accept == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Missing 'accept' parameter in request body"));
            }

            ContactRequest result = contactRequestService.handleRequest(requestId, owner.getId(), accept);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("status", result.getStatus().toString());
            resp.put("message", accept ? "Request accepted" : "Request rejected");
            if (accept) {
                Map<String, Object> contact = Map.of(
                        "phone", owner.getMobile(),
                        "email", owner.getEmail()
                );
                resp.put("contact", contact);
            }

            // --- NEW: send notification to the original requester (best-effort) ---
            try {
                Long requesterId = null;

                // Defensive checks depending on how ContactRequest stores the requester
                try {
                    // If ContactRequest contains a User object
                    if (result.getRequester() != null) {
                        requesterId = result.getRequester().getId();
                    }
                } catch (Throwable ignore) { /* ignore if getter not present */ }

                // If still null, try a primitive getter (requesterId)
                if (requesterId == null) {
                    try {
                        // If ContactRequest has getRequesterId()
                        requesterId = (Long) result.getClass().getMethod("getRequesterId").invoke(result);
                    } catch (Throwable ignore) { /* ignore */ }
                }

                if (requesterId != null) {
                    String title;
                    String message;
                    String actionUrl = "/profiles/" + profileId;// change if you want different frontend route

                    if (accept) {
                        title = owner.getName() + " accepted your contact request";
                        message = owner.getName() + " has accepted your request. You can view contact details in Requests.";
                        // optionally add phone/email in message only if not null
                        if (owner.getMobile() != null) message += " Phone: " + owner.getMobile();
                    } else {
                        title = owner.getName() + " rejected your contact request";
                        message = owner.getName() + " has rejected your request. You can view other matches.";
                    }

                    // Use NotificationService overload that accepts actionUrl (we added it earlier)
                    notificationService.createNotification(requesterId, title, message, "INTEREST", actionUrl);
                    System.out.println("🔔 Notification created for requesterId=" + requesterId + " requestId=" + requestId);
                } else {
                    System.out.println("⚠️ Could not determine requesterId for ContactRequest id=" + requestId + " — skipping notification");
                }
            } catch (Exception nEx) {
                // Don't fail the main request if notifications fail
                nEx.printStackTrace();
                System.out.println("⚠️ Failed to create notification for requestId=" + requestId + " : " + nEx.getMessage());
            }
            // --- END notification block ---

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to handle request: " + e.getMessage()));
        }
    }

    @GetMapping("/{profileId}/request-status")
    public ResponseEntity<?> getRequestStatus(
            @PathVariable Long profileId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        try {
            User requester = extractUserFromToken(authorizationHeader);
            if (requester == null) {
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }

            Optional<Profile> profileOpt = profileService.getProfileEntityById(profileId);
            if (profileOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Profile not found"));
            }
            User profileOwner = profileOpt.get().getUser();

            Optional<ContactRequest> crOpt = contactRequestService.getRequestStatus(requester.getId(), profileOwner.getId());
            if (crOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of("success", true, "status", "NONE"));
            }

            ContactRequest cr = crOpt.get();
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("status", cr.getStatus().toString());
            if (cr.getStatus() == ContactRequest.Status.ACCEPTED) {
                resp.put("contact", Map.of("phone", profileOwner.getMobile(), "email", profileOwner.getEmail()));
            }
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to fetch request status: " + e.getMessage()));
        }
    }

    @PostMapping("/{profileId}/accept-contact")
    public ResponseEntity<?> acceptContactRequest(
            @PathVariable Long profileId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        System.out.println("========== ACCEPT-CONTACT DEBUG ==========");
        System.out.println("🔍 Request to accept contact for Profile ID: " + profileId);

        try {
            // 1. Get current user
            User currentUser = extractUserFromToken(authorizationHeader);
            if (currentUser == null) {
                System.out.println("❌ No authenticated user found");
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }
            System.out.println("✅ Authenticated User: " + currentUser.getName() + " (ID: " + currentUser.getId() + ")");

            // 2. Check if profile exists
            Optional<Profile> profileOpt = profileService.getProfileEntityById(profileId);
            if (profileOpt.isEmpty()) {
                System.out.println("❌ Profile " + profileId + " not found in database");
                return ResponseEntity.status(404).body(createErrorResponse("Profile not found"));
            }

            Profile profile = profileOpt.get();
            System.out.println("✅ Found Profile: " + profile.getName() + " (ID: " + profile.getId() + ")");

            // 3. Check who owns this profile
            if (profile.getUser() == null) {
                System.out.println("❌ Profile has no owner user");
                return ResponseEntity.status(500).body(createErrorResponse("Profile data error"));
            }

            User profileOwner = profile.getUser();
            System.out.println("🔍 Profile Owner: " + profileOwner.getName() + " (ID: " + profileOwner.getId() + ")");
            System.out.println("🔍 Current User: " + currentUser.getName() + " (ID: " + currentUser.getId() + ")");

            // 4. Check if current user owns this profile
            if (!currentUser.getId().equals(profileOwner.getId())) {
                System.out.println("❌ AUTHORIZATION FAILED: Current user does not own this profile!");
                System.out.println("   Current user ID: " + currentUser.getId());
                System.out.println("   Profile owner ID: " + profileOwner.getId());
                return ResponseEntity.status(403).body(createErrorResponse(
                        "You are not authorized to accept contact requests for this profile. " +
                                "Only the profile owner can accept requests."));
            }

            System.out.println("✅ Authorization OK: User owns the profile");

            // 5. Find ALL pending requests in the system for debugging
            List<ContactRequest> allPendingRequests = contactRequestRepository.findAll()
                    .stream()
                    .filter(cr -> cr.getStatus() == ContactRequest.Status.PENDING)
                    .collect(Collectors.toList());

            System.out.println("🔍 Total pending requests in system: " + allPendingRequests.size());

            // 6. Find pending requests where current user is the PROFILE OWNER
            List<ContactRequest> myPendingRequests = allPendingRequests.stream()
                    .filter(cr -> cr.getProfileOwner() != null &&
                            cr.getProfileOwner().getId().equals(currentUser.getId()))
                    .collect(Collectors.toList());

            System.out.println("🔍 Pending requests where current user is profile owner: " + myPendingRequests.size());

            // 7. Show all pending requests for current user
            if (myPendingRequests.isEmpty()) {
                System.out.println("❌ No pending requests found for user: " + currentUser.getName());

                // Show all pending requests in system for debugging
                System.out.println("🔍 All pending requests in system:");
                for (ContactRequest req : allPendingRequests) {
                    System.out.println("   - ID: " + req.getId() +
                            ", Requester: " + (req.getRequester() != null ?
                            req.getRequester().getName() + " (ID: " + req.getRequester().getId() + ")" : "null") +
                            ", Owner: " + (req.getProfileOwner() != null ?
                            req.getProfileOwner().getName() + " (ID: " + req.getProfileOwner().getId() + ")" : "null"));
                }

                return ResponseEntity.status(404).body(createErrorResponse(
                        "No pending contact requests found for your profile."));
            }

            System.out.println("✅ Found " + myPendingRequests.size() + " pending request(s)");

            // 8. For debugging, show all pending requests
            for (int i = 0; i < myPendingRequests.size(); i++) {
                ContactRequest req = myPendingRequests.get(i);
                System.out.println("   " + (i+1) + ". Request ID: " + req.getId() +
                        ", From: " + (req.getRequester() != null ?
                        req.getRequester().getName() + " (ID: " + req.getRequester().getId() + ")" : "null"));
            }

            // 9. Accept the first pending request (or implement logic to accept specific one)
            ContactRequest requestToAccept = myPendingRequests.get(0);
            System.out.println("✅ Accepting request ID: " + requestToAccept.getId());

            ContactRequest result = contactRequestService.handleRequest(
                    requestToAccept.getId(), currentUser.getId(), true);

            // 10. Return success response
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "Contact request accepted successfully");
            resp.put("requestId", result.getId());

            if (result.getRequester() != null) {
                resp.put("requesterName", result.getRequester().getName());
            }

            // Include contact info
            Map<String, Object> contact = new HashMap<>();
            contact.put("name", currentUser.getName());

            if (currentUser.getMobile() != null && !currentUser.getMobile().trim().isEmpty()) {
                contact.put("phone", currentUser.getMobile());
            } else {
                contact.put("phone", "Not provided");
            }

            if (currentUser.getEmail() != null && !currentUser.getEmail().trim().isEmpty()) {
                contact.put("email", currentUser.getEmail());
            } else {
                contact.put("email", "Not provided");
            }

            resp.put("contact", contact);

            System.out.println("✅ CONTACT REQUEST ACCEPTED SUCCESSFULLY!");
            System.out.println("   Shared contact for: " + currentUser.getName());
            System.out.println("   Phone: " + (currentUser.getMobile() != null ? currentUser.getMobile() : "Not provided"));
            System.out.println("==========================================");

            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            System.out.println("❌ ERROR in acceptContactRequest:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(createErrorResponse(
                    "Failed to accept request: " + e.getMessage()));
        }
    }

    @GetMapping("/debug/user-info")
    public ResponseEntity<?> debugUserInfo(@RequestHeader(value = "Authorization") String authorizationHeader) {
        try {
            User currentUser = extractUserFromToken(authorizationHeader);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", currentUser.getId());
            response.put("userName", currentUser.getName());
            response.put("userEmail", currentUser.getEmail());
            response.put("userMobile", currentUser.getMobile());

            // Get user's profile
            Optional<Profile> profileOpt = profileService.getProfileEntityByUserId(currentUser.getId());
            if (profileOpt.isPresent()) {
                Profile profile = profileOpt.get();
                response.put("profileId", profile.getId());
                response.put("profileName", profile.getName());
            }

            // Get pending contact requests for this user
            List<ContactRequest> pendingRequests = contactRequestRepository
                    .findByProfileOwnerIdAndStatus(currentUser.getId(), ContactRequest.Status.PENDING);

            List<Map<String, Object>> requestsList = new ArrayList<>();
            for (ContactRequest req : pendingRequests) {
                Map<String, Object> reqInfo = new HashMap<>();
                reqInfo.put("id", req.getId());
                if (req.getRequester() != null) {
                    reqInfo.put("requesterId", req.getRequester().getId());
                    reqInfo.put("requesterName", req.getRequester().getName());
                }
                reqInfo.put("createdAt", req.getCreatedAt());
                requestsList.add(reqInfo);
            }

            response.put("pendingRequests", requestsList);
            response.put("pendingRequestCount", pendingRequests.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(createErrorResponse("Debug error: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/{profileId}/reject-contact", consumes = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> rejectContactRequest(
        @PathVariable Long profileId,
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
    try {
        User currentUser = extractUserFromToken(authorizationHeader);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
        }

        System.out.println("✅ Authenticated User - ID: " + currentUser.getId() + ", Name: " + currentUser.getName());

        // Find pending requests where current user is the PROFILE OWNER
        List<ContactRequest> pendingRequests = contactRequestRepository.findByProfileOwnerIdAndStatus(
            currentUser.getId(), ContactRequest.Status.PENDING);
        
        if (pendingRequests.isEmpty()) {
            return ResponseEntity.status(404).body(createErrorResponse("No pending requests found"));
        }

        // Find if any of these requests are for the specific profile
        ContactRequest requestToReject = null;
        for (ContactRequest req : pendingRequests) {
            if (req.getRequester() != null) {
                Optional<Profile> requesterProfile = profileService.getProfileEntityByUserId(req.getRequester().getId());
                if (requesterProfile.isPresent() && requesterProfile.get().getId().equals(profileId)) {
                    requestToReject = req;
                    break;
                }
            }
        }

        if (requestToReject == null) {
            return ResponseEntity.status(404).body(createErrorResponse("No pending request found for this profile"));
        }

        ContactRequest result = contactRequestService.handleRequest(requestToReject.getId(), currentUser.getId(), false);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Contact request rejected");
        resp.put("requestId", result.getId());
        
        if (result.getRequester() != null) {
            resp.put("requesterName", result.getRequester().getName());
        }

        return ResponseEntity.ok(resp);
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body(createErrorResponse("Failed to reject request: " + e.getMessage()));
    }
}

}
