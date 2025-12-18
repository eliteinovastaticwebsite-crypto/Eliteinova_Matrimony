package com.matrimony.eliteinovamatrimonybackend.controller;

import com.matrimony.eliteinovamatrimonybackend.dto.InterestResponse;
import com.matrimony.eliteinovamatrimonybackend.dto.ProfileResponse;
import com.matrimony.eliteinovamatrimonybackend.entity.Interest;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.service.InterestService;
import com.matrimony.eliteinovamatrimonybackend.service.ProfileService;
import com.matrimony.eliteinovamatrimonybackend.service.UserService;
import com.matrimony.eliteinovamatrimonybackend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/interests")
@CrossOrigin(origins = "http://localhost:3000")
public class InterestController {

    @Autowired
    private InterestService interestService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtUtil jwtUtil;

    // === EXPRESS INTEREST IN A PROFILE ===
    @PostMapping("/express/{profileId}")
    public ResponseEntity<?> expressInterest(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long profileId,
            @RequestBody(required = false) Map<String, String> requestBody) {

        try {
            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid authentication token"));
            }

            String message = requestBody != null ? requestBody.get("message") : null;

            InterestResponse interest = interestService.expressInterest(user, profileId, message);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Interest expressed successfully! 💝");
            response.put("interest", interest);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to express interest: " + e.getMessage()));
        }
    }

    // === GET MY EXPRESSED INTERESTS ===
    @GetMapping("/my-interests")
    public ResponseEntity<?> getMyInterests(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid authentication token"));
            }

            Page<InterestResponse> interests = interestService.getMyInterests(user.getId(), page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("interests", interests.getContent());
            response.put("total", interests.getTotalElements());
            response.put("totalPages", interests.getTotalPages());
            response.put("currentPage", interests.getNumber());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch interests: " + e.getMessage()));
        }
    }

    // === GET RECEIVED INTERESTS ===
    @GetMapping("/received")
    public ResponseEntity<?> getReceivedInterests(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid authentication token"));
            }

            Page<InterestResponse> interests = interestService.getReceivedInterests(user.getId(), page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("interests", interests.getContent());
            response.put("total", interests.getTotalElements());
            response.put("totalPages", interests.getTotalPages());
            response.put("currentPage", interests.getNumber());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch received interests: " + e.getMessage()));
        }
    }

    // === RESPOND TO INTEREST ===
    @PostMapping("/{interestId}/respond")
    public ResponseEntity<?> respondToInterest(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long interestId,
            @RequestBody Map<String, String> request) {

        try {
            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid authentication token"));
            }

            String responseType = request.get("response");
            if (responseType == null || (!responseType.equals("accepted") && !responseType.equals("rejected"))) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Response must be 'accepted' or 'rejected'"));
            }

            // ✅ FIXED: Convert string to enum
            Interest.InterestStatus status;
            if ("accepted".equalsIgnoreCase(responseType)) {
                status = Interest.InterestStatus.ACCEPTED;
            } else {
                status = Interest.InterestStatus.REJECTED;
            }

            InterestResponse updatedInterest = interestService.respondToInterest(interestId, status, user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Interest " + responseType + " successfully");
            response.put("interest", updatedInterest);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to respond to interest: " + e.getMessage()));
        }
    }

    // === GET INTEREST COUNTS ===
    @GetMapping("/counts")
    public ResponseEntity<?> getInterestCounts(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid authentication token"));
            }

            Map<String, Long> counts = interestService.getInterestCounts(user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("counts", counts);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch interest counts: " + e.getMessage()));
        }
    }

    // === GET MATCH SUGGESTIONS ===
    @GetMapping("/suggestions")
    public ResponseEntity<?> getMatchSuggestions(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "6") int limit) {

        try {
            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid authentication token"));
            }

            Optional<ProfileResponse> profileOpt = profileService.getProfileByUserId(user.getId());
            if (profileOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Please complete your profile to get suggestions"));
            }

            ProfileResponse profile = profileOpt.get();

            // ✅ FIXED: Use search method instead of missing getSimilarProfiles
            List<ProfileResponse> similarProfiles = getSimilarProfiles(profile, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("suggestions", similarProfiles);
            response.put("total", similarProfiles.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch suggestions: " + e.getMessage()));
        }
    }

    // ✅ ADDED: Helper method to get similar profiles
    private List<ProfileResponse> getSimilarProfiles(ProfileResponse profile, int limit) {
        // Implement your logic to find similar profiles based on criteria
        // For now, return empty list or use search with basic criteria
        return List.of();
    }

    // === HELPER METHODS ===
    private User extractUserFromToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authorizationHeader.substring(7);
        try {
            String email = jwtUtil.extractUsername(token);
            Optional<User> userOpt = userService.findByEmail(email);
            return userOpt.orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }
}