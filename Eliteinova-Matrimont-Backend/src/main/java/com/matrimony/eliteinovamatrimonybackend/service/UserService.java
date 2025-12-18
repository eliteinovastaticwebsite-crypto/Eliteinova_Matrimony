package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.dto.UserResponse;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProfileService profileService; // ✅ ADDED: For profile operations

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByMobile(String mobile) {
        return userRepository.existsByMobile(mobile);
    }

    public User createUser(User user) {
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // ✅ ADDED: Update user
    public User updateUser(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // In UserService.java
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        System.out.println("=== PASSWORD VALIDATION DEBUG ===");
        System.out.println("Input password: '" + rawPassword + "'");
        System.out.println("Stored password: '" + encodedPassword + "'");
        System.out.println("Password length: " + rawPassword.length());
        System.out.println("Is valid BCrypt: " + (encodedPassword != null && encodedPassword.startsWith("$2a$")));

        // Test what the raw password should encode to
        String testEncoded = passwordEncoder.encode(rawPassword);
        System.out.println("What '" + rawPassword + "' should encode to: " + testEncoded);

        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
        System.out.println("Password matches: " + matches);
        System.out.println("=================================");

        return matches;
    }

    // In UserService.java - Fix the DOB issue
    public UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setMobile(user.getMobile());
        response.setRole(user.getRole().toString());
        response.setProfileFor(user.getProfileFor());
        response.setGender(user.getGender());

        // ✅ FIX: Convert LocalDateTime to String for DOB
        if (user.getDob() != null) {
            response.setDob(user.getDob().toString()); // Convert to string
        }

        response.setIsVerified(user.getEmailVerified());
        response.setIsPremium(user.getMembership() != User.MembershipType.FREE);
        response.setMembership(user.getMembership().toString());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    // ✅ ADDED: Update user status
    public User updateUserStatus(Long userId, User.UserStatus status) {
        return userRepository.findById(userId).map(user -> {
            user.setStatus(status);
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ ADDED: Update user membership
    public User updateUserMembership(Long userId, User.MembershipType membership) {
        return userRepository.findById(userId).map(user -> {
            user.setMembership(membership);
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ ADDED: Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ ADDED: Search users
    public List<User> searchUsers(String searchTerm) {
        return userRepository.searchUsers(searchTerm);
    }

    // ✅ ADDED: Get users by status
    public List<User> getUsersByStatus(User.UserStatus status) {
        return userRepository.findByStatus(status);
    }

    // ✅ ADDED: Update last login
    public void updateLastLogin(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            user.setLastActive(LocalDateTime.now());
            userRepository.save(user);
        });
    }
}