package com.matrimony.eliteinovamatrimonybackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // ADDED MISSING FIELD

    @Column(unique = true)
    private String mobile;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    private MembershipType membership = MembershipType.FREE;

    // Basic profile info (minimal - detailed info in Profile entity)
    private String gender;
    private LocalDateTime dob; // Changed from String to LocalDateTime
    private String profileFor;

    // Verification fields
    private Boolean emailVerified = false;
    private Boolean phoneVerified = false;
    private Boolean profileVerified = false;

    // Activity tracking
    private LocalDateTime lastLogin;
    private LocalDateTime lastActive;
    private Integer profileCompletion = 0;

    // Timestamps
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    // Relationships
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Profile profile;

    @OneToMany(mappedBy = "fromUser", cascade = CascadeType.ALL)
    private List<Interest> sentInterests = new ArrayList<>();

    @OneToMany(mappedBy = "toUser", cascade = CascadeType.ALL)
    private List<Interest> receivedInterests = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PaymentTransaction> payments = new ArrayList<>();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public int getHour() {
        return 0;
    }

    // Enums
    public enum UserRole {
        USER, ADMIN
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED, PENDING
    }

    public enum MembershipType {
        FREE, SILVER, GOLD, PREMIUM, DIAMOND
    }
}