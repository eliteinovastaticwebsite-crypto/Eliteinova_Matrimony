package com.matrimony.eliteinovamatrimonybackend.controller;

import com.matrimony.eliteinovamatrimonybackend.dto.*;
import com.matrimony.eliteinovamatrimonybackend.entity.Profile;
import com.matrimony.eliteinovamatrimonybackend.entity.ProfilePhoto;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.service.*;
import com.matrimony.eliteinovamatrimonybackend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private ProfilePhotoService profilePhotoService;

    @Autowired
    private UserDocumentService userDocumentService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // === LOGIN ENDPOINT ===
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Optional<User> userOpt = userService.findByEmail(authRequest.getEmail());
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found! Please register."));
            }

            User user = userOpt.get();

            if (!userService.validatePassword(authRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(createErrorResponse("Invalid email or password"));
            }

            user.setLastLogin(LocalDateTime.now());
            user.setLastActive(LocalDateTime.now());
            userService.updateUser(user);

            String token = jwtUtil.generateToken(user.getEmail());
            UserResponse userResponse = userService.convertToUserResponse(user);

            AuthResponse authResponse = new AuthResponse(
                    token,
                    "Login successful",
                    userResponse,
                    user.getRole() == User.UserRole.ADMIN
            );

            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Login failed: " + e.getMessage()));
        }
    }

    // === REGISTER ENDPOINT WITH FILE UPLOAD (unchanged signature for existing frontend) ===
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerMultipart(
            @RequestPart("user") RegisterRequest registerRequest,
            @RequestPart(value = "photos", required = false) MultipartFile[] photos,
            @RequestPart(value = "jathagam", required = false) MultipartFile jathagam,
            @RequestPart(value = "resume", required = false) MultipartFile resume) {

        System.out.println("📥 DEBUG - RegisterRequest received:");
        System.out.println("   Mobile: " + registerRequest.getMobile());
        System.out.println("   Specialization: " + registerRequest.getSpecialization());
        System.out.println("   MinAge: " + registerRequest.getMinAge());
        System.out.println("   MaxAge: " + registerRequest.getMaxAge());

        // Delegate to shared processor
        return processRegistration(registerRequest, photos, jathagam, resume);
    }

    // === NEW: REGISTER ENDPOINT FOR PURE JSON (no files) ===
    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerJson(@RequestBody RegisterRequest registerRequest) {
        // For JSON requests, pass null for files
        return processRegistration(registerRequest, null, null, null);
    }

    // ---------- SHARED PROCESSING LOGIC (original registration logic moved here) ----------
    private ResponseEntity<?> processRegistration(
            RegisterRequest registerRequest,
            MultipartFile[] photos,
            MultipartFile jathagam,
            MultipartFile resume) {

        try {
            System.out.println("🚀 Starting registration (processRegistration) ...");

            // ✅ ADD PASSWORD DEBUGGING
            System.out.println("🔐 Registration Password Debug:");
            System.out.println("   - Raw password: " + registerRequest.getPassword());
            System.out.println("   - Password length: " + (registerRequest.getPassword() != null ?
                    registerRequest.getPassword().length() : 0));

            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
            System.out.println("   - Encoded password: " + encodedPassword);
            System.out.println("   - Is valid BCrypt: " + (encodedPassword != null && encodedPassword.startsWith("$2a$")));

            // Validation
            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("An account with this email already exists"));
            }

            // Create User
            User newUser = new User();
            newUser.setName(registerRequest.getName());
            newUser.setEmail(registerRequest.getEmail().toLowerCase().trim()); // Normalize email
            newUser.setPassword(encodedPassword); // Use the encoded password
            newUser.setMobile(registerRequest.getMobile());
            newUser.setProfileFor(registerRequest.getProfileFor());
            newUser.setGender(registerRequest.getGender());

            // Handle DOB
            if (registerRequest.getDob() != null && !registerRequest.getDob().isEmpty()) {
                try {
                    LocalDate dob = LocalDate.parse(registerRequest.getDob());
                    newUser.setDob(dob.atStartOfDay());
                } catch (Exception e) {
                    System.out.println("Date parsing error: " + e.getMessage());
                    newUser.setDob(null);
                }
            }

            newUser.setRole(User.UserRole.USER);
            newUser.setStatus(User.UserStatus.ACTIVE);
            newUser.setMembership(User.MembershipType.FREE);
            newUser.setEmailVerified(false);
            newUser.setPhoneVerified(false);
            newUser.setProfileVerified(false);

            User savedUser = userService.createUser(newUser);
            System.out.println("✅ User created: " + savedUser.getId());

            // Create Profile
            Profile profile = createProfileFromRequest(registerRequest, savedUser);
            Profile savedProfile = profileService.createProfile(profile);
            System.out.println("✅ Profile created: " + savedProfile.getId());

            // Handle file uploads immediately (safe to call with nulls)
            handleRegistrationFileUploads(savedUser, photos, jathagam, resume);

            String token = jwtUtil.generateToken(savedUser.getEmail());
            UserResponse userResponse = userService.convertToUserResponse(savedUser);

            AuthResponse authResponse = new AuthResponse(
                    token,
                    "Registration successful. Welcome to BalaSabari Matrimony!",
                    userResponse,
                    false
            );

            System.out.println("🎉 Registration completed successfully");
            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            System.err.println("❌ Registration failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Registration failed: " + e.getMessage()));
        }
    }

    // === FILE UPLOAD HANDLER (kept as you provided) ===
    private void handleRegistrationFileUploads(User user, MultipartFile[] photos,
                                               MultipartFile jathagam, MultipartFile resume) {
        try {
            System.out.println("📤 Handling file uploads for user: " + user.getId());

            // Handle profile photos
            if (photos != null && photos.length > 0) {
                System.out.println("📸 Uploading " + photos.length + " photos...");

                List<String> uploadedPhotoUrls = new ArrayList<>();

                for (int i = 0; i < photos.length; i++) {
                    MultipartFile photo = photos[i];
                    if (!photo.isEmpty()) {
                        try {
                            System.out.println("🔼 Uploading photo " + (i + 1) + ": " + photo.getOriginalFilename());
                            String filePath = fileUploadService.uploadProfilePhoto(photo, user.getId());
                            String imageUrl = filePath; // Store relative path

                            // Save to profile photos
                            ProfilePhoto savedPhoto = profilePhotoService.saveProfilePhoto(user, imageUrl);
                            uploadedPhotoUrls.add(imageUrl);

                            System.out.println("✅ Photo uploaded: " + imageUrl);

                        } catch (Exception photoError) {
                            System.err.println("❌ Failed to upload photo " + photo.getOriginalFilename() + ": " + photoError.getMessage());
                            // Continue with other photos
                        }
                    }
                }

                // Update profile with all uploaded photos
                if (!uploadedPhotoUrls.isEmpty()) {
                    Profile profile = profileService.getProfileEntityByUserId(user.getId())
                            .orElseThrow(() -> new RuntimeException("Profile not found"));

                    profile.setPhotos(uploadedPhotoUrls);
                    profileService.createProfile(profile);
                    System.out.println("✅ Updated profile with " + uploadedPhotoUrls.size() + " photos");
                }
            }

            // Handle jathagam document
            if (jathagam != null && !jathagam.isEmpty()) {
                try {
                    System.out.println("📜 Uploading jathagam: " + jathagam.getOriginalFilename());
                    String filePath = fileUploadService.uploadDocument(jathagam, user.getId(), "JATHAGAM");
                    String documentUrl = filePath;
                    userDocumentService.saveUserDocument(user.getId(), "JATHAGAM", documentUrl, jathagam);
                    System.out.println("✅ Jathagam uploaded: " + documentUrl);
                } catch (Exception jathagamError) {
                    System.err.println("❌ Failed to upload jathagam: " + jathagamError.getMessage());
                }
            }

            // Handle resume document
            if (resume != null && !resume.isEmpty()) {
                try {
                    System.out.println("📄 Uploading resume: " + resume.getOriginalFilename());
                    String filePath = fileUploadService.uploadDocument(resume, user.getId(), "RESUME");
                    String documentUrl = filePath;
                    userDocumentService.saveUserDocument(user.getId(), "RESUME", documentUrl, resume);
                    System.out.println("✅ Resume uploaded: " + documentUrl);
                } catch (Exception resumeError) {
                    System.err.println("❌ Failed to upload resume: " + resumeError.getMessage());
                }
            }

            System.out.println("✅ All file uploads completed for user: " + user.getId());

        } catch (Exception e) {
            System.err.println("❌ File upload during registration failed: " + e.getMessage());
            // Don't throw exception - registration should succeed even if files fail
        }
    }

    private Profile createProfileFromRequest(RegisterRequest request, User user) {
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setName(request.getName());

        System.out.println("🔍 DEBUG - Creating profile with data:");
        System.out.println("   Mobile: " + request.getMobile());
        System.out.println("   Specialization: " + request.getSpecialization());
        System.out.println("   MinAge: " + request.getMinAge());
        System.out.println("   MaxAge: " + request.getMaxAge());

        // Set age from request or calculate
        if (request.getAge() != null) {
            profile.setAge(request.getAge());
        } else if (request.getDob() != null) {
            try {
                LocalDate dob = LocalDate.parse(request.getDob());
                int age = Period.between(dob, LocalDate.now()).getYears();
                profile.setAge(age);
            } catch (Exception e) {
                profile.setAge(25); // default
            }
        }

        // Set gender with safe conversion
        profile.setGender(Profile.safeGender(request.getGender()));

        // Set other profile fields from RegisterRequest
        profile.setEducation(request.getEducation());
        profile.setProfession(request.getProfession());
        profile.setOccupation(request.getOccupation());
        profile.setEmployedIn(request.getEmployedIn());
        profile.setAnnualIncome(request.getAnnualIncome());
        profile.setCity(request.getCity());
        profile.setDistrict(request.getDistrict());
        profile.setState(request.getState());
        profile.setCountry(request.getCountry());
        profile.setReligion(request.getReligion());
        profile.setCaste(request.getCaste());
        profile.setSubCaste(request.getSubCaste());
        profile.setDosham(request.getDosham());
        profile.setWillingOtherCaste(request.getWillingOtherCaste());
        profile.setMaritalStatus(Profile.safeMaritalStatus(request.getMaritalStatus()));
        profile.setFamilyStatus(request.getFamilyStatus());
        profile.setFamilyType(request.getFamilyType());
        profile.setHeight(request.getHeight());
        profile.setAbout(request.getAbout());

        // ✅ FIXED: SET ALL FIELDS IN ONE PLACE (NO DUPLICATES)
        profile.setMobile(request.getMobile());
        profile.setSpecialization(request.getSpecialization());
        profile.setMinAge(request.getMinAge());
        profile.setMaxAge(request.getMaxAge());

        // ✅ REMOVE THESE DUPLICATE LINES - THEY'RE CAUSING CONFUSION
        // if (request.getMinAge() != null) profile.setMinAge(request.getMinAge());
        // if (request.getMaxAge() != null) profile.setMaxAge(request.getMaxAge());

        System.out.println("✅ DEBUG - Profile fields set (FINAL):");
        System.out.println("   Profile.mobile: " + profile.getMobile());
        System.out.println("   Profile.specialization: " + profile.getSpecialization());
        System.out.println("   Profile.minAge: " + profile.getMinAge());
        System.out.println("   Profile.maxAge: " + profile.getMaxAge());

        return profile;
    }

    // === GET CURRENT USER ENDPOINT ===
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(createErrorResponse("Invalid authorization header"));
            }

            String token = authorizationHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found"));
            }

            UserResponse userResponse = userService.convertToUserResponse(userOpt.get());

            Map<String, Object> response = new HashMap<>();
            response.put("user", userResponse);
            response.put("isAdmin", userOpt.get().getRole() == User.UserRole.ADMIN);
            response.put("success", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to get user: " + e.getMessage()));
        }
    }

    // === CHECK AUTH STATUS ===
    @GetMapping("/check")
    public ResponseEntity<?> checkAuthStatus(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.ok(createAuthStatusResponse(false, null, false));
            }

            String token = authorizationHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.ok(createAuthStatusResponse(false, null, false));
            }

            String email = jwtUtil.extractUsername(token);
            Optional<User> userOpt = userService.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.ok(createAuthStatusResponse(false, null, false));
            }

            UserResponse userResponse = userService.convertToUserResponse(userOpt.get());
            return ResponseEntity.ok(createAuthStatusResponse(true, userResponse, userOpt.get().getRole() == User.UserRole.ADMIN));

        } catch (Exception e) {
            return ResponseEntity.ok(createAuthStatusResponse(false, null, false));
        }
    }

    // === LOGOUT ENDPOINT ===
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    // === HELPER METHODS ===
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }

    private Map<String, Object> createAuthStatusResponse(boolean isAuthenticated, UserResponse user, boolean isAdmin) {
        Map<String, Object> response = new HashMap<>();
        response.put("isAuthenticated", isAuthenticated);
        response.put("user", user);
        response.put("isAdmin", isAdmin);
        response.put("success", true);
        return response;
    }

    // === TEST ENDPOINTS ===
    @GetMapping("/test")
    public String testAuth() {
        return "Auth controller is working!";
    }

    @GetMapping("/generate-password")
    public String generatePassword() {
        return "Encoded password for 'admin123': " + passwordEncoder.encode("admin123");
    }
}
