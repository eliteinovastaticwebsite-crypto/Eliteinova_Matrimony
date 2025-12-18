package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.dto.InterestResponse;
import com.matrimony.eliteinovamatrimonybackend.entity.Interest;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.repository.InterestRepository;
import com.matrimony.eliteinovamatrimonybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InterestService {

    @Autowired
    private InterestRepository interestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileService profileService;

    // Express interest in a user
    public InterestResponse expressInterest(User fromUser, Long toUserId, String message) {
        // Check if target user exists
        Optional<User> toUserOpt = userRepository.findById(toUserId);
        if (toUserOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User toUser = toUserOpt.get();

        // Check if user is trying to express interest in themselves
        if (toUser.getId().equals(fromUser.getId())) {
            throw new RuntimeException("Cannot express interest in yourself");
        }

        // Check if interest was already expressed in last 24 hours
        List<Interest> recentInterests = interestRepository.findRecentInterests(fromUser.getId(), toUserId);
        if (!recentInterests.isEmpty()) {
            throw new RuntimeException("Interest already expressed in the last 24 hours");
        }

        // Create new interest
        Interest interest = new Interest();
        interest.setFromUser(fromUser);
        interest.setToUser(toUser);
        interest.setMessage(message);
        interest.setExpressedAt(LocalDateTime.now());
        interest.setStatus(Interest.InterestStatus.PENDING);

        Interest savedInterest = interestRepository.save(interest);
        return convertToResponse(savedInterest);
    }

    // Get interests expressed by user
    public Page<InterestResponse> getMyInterests(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "expressedAt"));
        Page<Interest> interests = interestRepository.findByFromUserIdOrderByExpressedAtDesc(userId, pageable);
        return interests.map(this::convertToResponse);
    }

    // Get interests received by user
    public Page<InterestResponse> getReceivedInterests(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "expressedAt"));
        Page<Interest> interests = interestRepository.findReceivedInterests(userId, pageable);
        return interests.map(this::convertToResponse);
    }

    // Respond to interest (accept/reject)
    public InterestResponse respondToInterest(Long interestId, Interest.InterestStatus response, Long userId) {
        Optional<Interest> interestOpt = interestRepository.findById(interestId);
        if (interestOpt.isEmpty()) {
            throw new RuntimeException("Interest not found");
        }

        Interest interest = interestOpt.get();

        // Verify that the interest is for the user
        if (!interest.getToUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to respond to this interest");
        }

        interest.setStatus(response);
        interest.setRespondedAt(LocalDateTime.now());

        Interest updatedInterest = interestRepository.save(interest);
        return convertToResponse(updatedInterest);
    }

    // Get pending interests for user
    public Page<InterestResponse> getPendingInterests(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "expressedAt"));
        Page<Interest> interests = interestRepository.findByToUserIdAndStatusOrderByExpressedAtDesc(
                userId, Interest.InterestStatus.PENDING, pageable);
        return interests.map(this::convertToResponse);
    }

    // ✅ REMOVE or FIX this duplicate method - it's causing confusion
    // Option 1: Remove it completely (recommended) since we have the repository method
    /*
    public List<Interest> findRecentInterests(Long fromUserId, Long toUserId) {
        // Just delegate to the repository method we fixed
        return interestRepository.findRecentInterests(fromUserId, toUserId);
    }
    */

    // Option 2: Or if you need additional filtering, keep it but use the repository method
    public List<Interest> findRecentInterestsWithAdditionalFilter(Long fromUserId, Long toUserId) {
        List<Interest> interests = interestRepository.findRecentInterests(fromUserId, toUserId);
        // Add any additional filtering logic here if needed
        return interests.stream()
                .filter(interest -> interest.getStatus() == Interest.InterestStatus.PENDING) // Example additional filter
                .collect(Collectors.toList());
    }

    // Convert entity to response DTO
    private InterestResponse convertToResponse(Interest interest) {
        InterestResponse response = new InterestResponse();
        response.setId(interest.getId());
        response.setFromUserId(interest.getFromUser().getId());
        response.setFromUserName(interest.getFromUser().getName());
        response.setToProfileId(interest.getToUser().getId());
        response.setToProfileName(interest.getToUser().getName());
        response.setStatus(interest.getStatus().toString());
        response.setExpressedAt(interest.getExpressedAt());
        response.setRespondedAt(interest.getRespondedAt());
        response.setMessage(interest.getMessage());

        // Include profile details if available
        if (interest.getToUser().getProfile() != null) {
            response.setProfile(profileService.convertToResponse(interest.getToUser().getProfile()));
        }

        return response;
    }

    // Get interest count for user
    public Map<String, Long> getInterestCounts(Long userId) {
        Map<String, Long> counts = new HashMap<>();
        counts.put("expressed", interestRepository.countByFromUserId(userId));
        counts.put("received", interestRepository.countByToUserId(userId));

        // For pending count, use a count query instead of getting all records
        Page<Interest> pendingInterests = interestRepository.findByToUserIdAndStatusOrderByExpressedAtDesc(
                userId, Interest.InterestStatus.PENDING, PageRequest.of(0, 1));
        counts.put("pending", pendingInterests.getTotalElements());

        return counts;
    }

    // ✅ ADD this method if you need to check for any existing interest (not time-bound)
    public List<Interest> findExistingInterests(Long fromUserId, Long toUserId) {
        return interestRepository.findByFromUserIdAndToUserId(fromUserId, toUserId);
    }
}